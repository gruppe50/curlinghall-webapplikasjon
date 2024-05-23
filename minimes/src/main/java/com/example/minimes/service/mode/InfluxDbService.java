package com.example.minimes.service.mode;


import com.example.minimes.model.experiment.*;

import com.google.type.Decimal;
import com.influxdb.v3.client.InfluxDBClient;
import com.influxdb.v3.client.PointValues;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.text.DecimalFormat;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

/*influxdb.url=https://eu-central-1-1.aws.cloud2.influxdata.com/
influxdb.token=yX5pcaDdtDsg69FzZ2tL5qFUrb8fbVnYaOB0NwOg707Azk9S9YOFIYeggA4J8pNKOBKJUH89AI4EWVd1CESanA==
influxdb.org=gruppe3
influxdb.bucket=curlinghall
*/
@Service
public class InfluxDbService {
    private static final Logger logger = LoggerFactory.getLogger(InfluxDbService.class);
    @Value("https://eu-central-1-1.aws.cloud2.influxdata.com/")
    private String influxDBurl;

    @Value("#{systemEnvironment['InfluxDBTOKEN']}")
    private String token;

    @Value("gruppe3")
    private String org;

    @Value("curlinghall")
    private String bucket;

    private InfluxDBClient client;


    @PostConstruct
    public void initializeInfluxDBClient() {
        System.out.println(token);
        //this.token = System.getenv("InfluxDBTOKEN");
        char[] authToken = token.toCharArray();
        client = InfluxDBClient.getInstance(influxDBurl, authToken, bucket);
        System.out.println("Client initialized");
    }


    public List<Measurement> fetchAllData(LocalDateTime start, LocalDateTime end) {
        String query = makeQuery(start, end);

        List<Measurement> mesurementsList = new ArrayList<>();
        System.out.println(query);
        System.out.println("Fetching data from InfluxDB");

        //Creates a query to the InfluxDB where we want to add the output into measurement objects.
        //The time needs to be converted back to the original (Oslo) timezone.
        try (Stream<PointValues> stream = client.queryPoints(query)) {
            stream.forEach((PointValues p) -> {
                //System.out.println(p.getField("hall_humidity", Double.class));


                ZonedDateTime osloTimezoneTime = convertDateTime(p);

                //Convert to localtime
                LocalTime time = osloTimezoneTime.toLocalTime();


                Measurement measurement = new Measurement();

                measurement.setTime(time);
                double bigLaneTemp = (p.getField("t1_end", Double.class) + p.getField("t1_mid", Double.class) / 2);
                double smallLaneTemp = (p.getField("t4_end", Double.class) + p.getField("t4_mid", Double.class) / 2);
                double hallTemp  = p.getField("hall_temp", Double.class);
                measurement.setSmallLaneIceTemp(smallLaneTemp);
                measurement.setBigLaneIceTemp(bigLaneTemp);
                measurement.setHumudity(p.getField("hall_humidity", Double.class));
                measurement.setHallTemp(hallTemp);
                mesurementsList.add(measurement);

            });
            //Returns a list of measurementlist objects with the data from the influxDB.
            return mesurementsList;
        } catch (Exception e) {
            System.out.println("Error while fetching data from InfluxDB " + e.getMessage());
            return null;
        }
    }

    //This function will add the measurements into out testDates objects
    public List<TestDates> addMeasurementData(List<TestDates> testDatesList, List<LocalDateTime> startDateTimeList, List<LocalDateTime> endDateTimeList) {
        //Loops through all startdatetimes in our testdates list.
        for (int i = 0; i < startDateTimeList.size(); i++) {
            System.out.println("DateTime : " + startDateTimeList.get(i));
            //Ask influx DB for the data betwwen the starttime and end time and gets a list of measurements objects.
            List<Measurement> measurementList = fetchAllData(startDateTimeList.get(i), endDateTimeList.get(i));

            //Loops through our testDates and sets the correct measurements for the testdates
            for (TestDates testDates : testDatesList) {
                //If the starttime is the same for the testDate and for the test we are currently looping through
                LocalDateTime testDateDateTime = LocalDateTime.of(testDates.getDate(), testDates.getTest().getStartTime());
                if (testDateDateTime.equals(startDateTimeList.get(i))) {
                    System.out.println("Setter measurement");
                    testDates.setMeasurement(measurementList);
                    //Sets the correct testdates object for the measurement objects
                    for (Measurement measurement : measurementList) {
                        measurement.setTestDates(testDates);
                    }
                }
            }
            //Returns the updates testdatesList with correct measurementList


        }
        return testDatesList;
    }

    public List<MeasurementDTO> fetchDataForLastWeek(LocalDateTime from, LocalDateTime to) {
        String query = makeQuery(from, to);

        List<MeasurementDTO> mesurementsListDTO = new ArrayList<>();
        //Creates a query to the InfluxDB where we want to add the output into measurement objects.
        //The time needs to be converted back to the original (Oslo) timezone.
        try (Stream<PointValues> stream = client.queryPoints(query)) {
            stream.forEach((PointValues p) -> {
                ZonedDateTime osloTimezoneTime = convertDateTime(p);
                //Convert to localtime
                LocalDateTime dateTime = osloTimezoneTime.toLocalDateTime();

                MeasurementDTO measurementDTO = new MeasurementDTO();
                measurementDTO.setTime(dateTime);
                measurementDTO.setSmallLaneIceTemp((p.getField("t1_end", Double.class) + p.getField("t1_mid", Double.class)) / 2);
                measurementDTO.setBigLaneIceTemp((p.getField("t4_end", Double.class) + p.getField("t4_mid", Double.class)) / 2);
                measurementDTO.setHumudity(p.getField("hall_humidity", Double.class));
                measurementDTO.setHallTemp(p.getField("hall_temp", Double.class));
                mesurementsListDTO.add(measurementDTO);

            });
            //Returns a list of measurementlist objects with the data from the influxDB.
            return mesurementsListDTO;
        } catch (Exception e) {
            System.out.println("Error while fetching data from InfluxDB " + e.getMessage());
            return null;
        }
    }

    private String makeQuery(LocalDateTime start, LocalDateTime end) {
        //Since the Influx DB has the timezone of UTC and our input data is in the Oslo timezone we
        //need to convert our start time and end time to UTC timezone before we send in a query to the DB.
        ZoneId zoneId = ZoneId.of("Europe/Oslo");
        //Convert to Zoneddatetime
        ZonedDateTime osloZoneStart = start.atZone(zoneId);
        ZonedDateTime osloZoneEnd = end.atZone(zoneId);

        //Change timezone to utc, and changes the time to be correct
        ZonedDateTime utcStart = osloZoneStart.withZoneSameInstant(ZoneId.of("UTC"));
        ZonedDateTime utcEnd = osloZoneEnd.withZoneSameInstant(ZoneId.of("UTC"));

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm");
        //Creates string in correct format for the SQL query
        String stringTime = "'" + utcStart.format(formatter) + ":00'";
        String stringTime2 = "'" + utcEnd.format(formatter) + ":00'";

        String query = "SELECT time, MAX(hall_humidity) AS hall_humidity,  MAX(hall_temp) AS hall_temp,  MAX(temp_small_lane_track1_end) AS t1_end," +
                " MAX(temp_small_lane_track1_mid) AS t1_mid, MAX(\"temp_bigLane_track4_end\") AS t4_end, MAX(\"temp_bigLane_track4_mid\") AS t4_mid  " +
                "FROM opcua2 " +
                "WHERE time BETWEEN " + stringTime + " AND " + stringTime2 + " " +
                "GROUP BY time " +
                "ORDER BY time ASC";
        return query;
    }
    private ZonedDateTime convertDateTime(PointValues p) {
        Number timestampInNanoseconds = p.getTimestamp();
        //Convert timestamp to instant in milliseconds
        Instant instant = Instant.ofEpochMilli(timestampInNanoseconds.longValue() / 1_000_000); // Convert nanoseconds to milliseconds
        //Convert to localdatetime with UTC timezone
        LocalDateTime localDateTime = LocalDateTime.ofInstant(instant, ZoneId.of("UTC"));
        //Convert to zoneddatetime
        ZonedDateTime utcLocalDateTime = localDateTime.atZone(ZoneId.of("UTC"));
        //Convert zonedatetime back to correct timezone
        ZonedDateTime osloTimezoneTime = utcLocalDateTime.withZoneSameInstant(ZoneId.of("Europe/Oslo"));
        return osloTimezoneTime;
    }

}

