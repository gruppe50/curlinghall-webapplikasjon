import os
import asyncio
import logging
import math
from pylogix import PLC


from asyncua import Server, ua
from asyncua.common.methods import uamethod
from asyncua.server.users import UserRole, User

import mysql.connector
from mysql.connector import errorcode

radians = 0

#A list of "Users"
users_db =  {
    os.environ.get("OPCUA_USERNAME"): os.environ.get("OPCUA_PASSWORD")
}

config = {
    'user': os.environ.get("OPCUA_DB_USER"),
    'password': os.environ.get("OPCUA_DB_PASSWORD"),
    'host': os.environ.get("OPCUA_DB_HOST"),
    'database': os.environ.get("OPCUA_DB")
}

cnx = cur = None


class UserManager:
    def get_user(self, iserver, username=None, password=None, certificate=None):
        if username in users_db and password == users_db[username]:
            return User(role=UserRole.User)
        return None

@uamethod
def commandFunc(parent, command, value):
    try:
        cnx = mysql.connector.connect(**config)
    except mysql.connector.Error as err:
        if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
            print('Something is wrong with your user name or password')
        elif err.errno == errorcode.ER_BAD_DB_ERROR:
            print("Database does not exist")
        else:
            print(err)
    else:
        cur = cnx.cursor()
        cur.execute('show databases;')
        for row in cur.fetchall():
            print(row)

    sql = "INSERT INTO plc_command (command, value) VALUES (%s, %s)"
    values = (command, value)
    cur.execute(sql, values)
    cnx.commit()

    if cur:
        cur.close()
    if cnx:
        cnx.close()



async def main():
    _logger = logging.getLogger(__name__)
    # setup our server
    server = Server(user_manager=UserManager())
    await server.init()
    server.set_endpoint(os.environ.get("OPCUA_ENDPOINT"))

    # set up our own namespace, not really necessary but should as spec
    uri = os.environ.get("OPCUA_NAMESPACE")
    idx = await server.register_namespace(uri)

    server.set_security_IDs(["Username"])

    #Under we are creating different variables that we can use later to get data from our sensors
    #Identifier 1
    temp_bigLane_track4_mid = await server.nodes.objects.add_variable(idx,"temp_bigLane_track4_mid", 4.5)
    #Identifier 2
    temp_bigLane_track4_end = await server.nodes.objects.add_variable(idx,"temp_bigLane_track4_end", 4.5)
    #Identifier 3
    temp_small_lane_track1_mid = await server.nodes.objects.add_variable(idx,"temp_small_lane_track1_mid", 4.5)
    #Identifier 4
    temp_small_lane_track1_end = await server.nodes.objects.add_variable(idx,"temp_small_lane_track1_end", 4.5)
    #Indetifier 5
    hall_temp = await server.nodes.objects.add_variable(idx, "hall_temp", 4.5)
    #Identifier 6
    hall_humidity = await server.nodes.objects.add_variable(idx, "hall_humidity", 4.5)
    #Identifier 7
    glycol_out_temp = await server.nodes.objects.add_variable(idx, "glycol_out_temp", 4.5)
    #Identifier 8
    glycol_in_temp = await server.nodes.objects.add_variable(idx, "glycol_in_temp", 4.5)
    #Identifier 9
    pressure_cond = await server.nodes.objects.add_variable(idx, "pressure_cond", 4.5)


    #Sets all of our variables to writeable
    await temp_bigLane_track4_mid.set_writable()
    await temp_bigLane_track4_end.set_writable()
    await temp_small_lane_track1_mid.set_writable()
    await temp_small_lane_track1_end.set_writable()
    await hall_temp.set_writable()
    await hall_humidity.set_writable()
    await glycol_out_temp.set_writable()
    await glycol_in_temp.set_writable()
    await pressure_cond.set_writable()

    await server.nodes.objects.add_method(
        ua.NodeId("WriteFunc", idx),
        ua.QualifiedName("WriteFunc", idx),
        commandFunc,
        [ua.VariantType.Int64],
        [ua.VariantType.String],
    )


    _logger.info("Starting server!")
    async with server:
        last_value = 0
        while True:
            await asyncio.sleep(5)

            #Inside here we are reading all of our values from our sensors
            #and writing them to our variables
            with PLC("192.168.0.101") as comm:
                # comm.Micro800 = 1
                await temp_bigLane_track4_mid.write_value(comm.Read('LaneFour_PT2').Value)
                await temp_bigLane_track4_end.write_value(comm.Read('LaneFour_PT3').Value)
                await temp_small_lane_track1_mid.write_value(comm.Read('LaneTwo_PT2').Value)
                await temp_small_lane_track1_end.write_value(comm.Read('LaneTwo_PT3').Value)
                await hall_temp.write_value(comm.Read("Hall_temp").Value)
                await hall_humidity.write_value(comm.Read("Hall_Humidity").Value)
                await glycol_out_temp.write_value(comm.Read("Glycol_out").Value)
                await glycol_in_temp.write_value(comm.Read("Glycol_in").Value)
                await pressure_cond.write_value(comm.Read("Pressure_cond").Value)

            #For writing out values in our logger
            t4_midVal = await temp_bigLane_track4_mid.get_value()
            t4_endVal = await temp_bigLane_track4_end.get_value()
            t1_midVal = await temp_small_lane_track1_mid.get_value()
            t1_endVal = await temp_small_lane_track1_end.get_value()
            h_temp = await hall_temp.get_value()
            h_humidity = await hall_humidity.get_value()
            g_out_temp = await glycol_out_temp.get_value()
            g_in_temp = await glycol_in_temp.get_value()
            p_cond = await pressure_cond.get_value()

            if(t4_midVal != last_value):
                _logger.info("Biglane track 4 middle temp is: " + str(t4_midVal))
                _logger.info("Biglane track 4 end temp is: " + str(t4_endVal))
                _logger.info("Small lane track 1 middle temp is: " + str(t1_midVal))
                _logger.info("Small lane track 1 end temp is" + str(t1_endVal))
                _logger.info("Hall temperature : " + str(h_temp))
                _logger.info("Hall humidity : " + str(h_humidity) + "%")
                _logger.info("Out GlycolTemp is " + str(g_out_temp))
                _logger.info("In GLycolTemp is " + str(g_in_temp))
                _logger.info("Pressure cond is " + str(p_cond))

                last_value = t4_midVal

if __name__ == "__main__":
    logging.basicConfig(level=logging.DEBUG)
    asyncio.run(main(), debug=True)
