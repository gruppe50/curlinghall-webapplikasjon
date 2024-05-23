package com.example.minimes.opcua;

import com.example.minimes.model.StatusHall;
import com.example.minimes.model.experiment.Schedule;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import jakarta.persistence.PrePersist;
import org.eclipse.milo.opcua.sdk.client.OpcUaClient;
import org.eclipse.milo.opcua.sdk.client.api.identity.UsernameProvider;
import org.eclipse.milo.opcua.stack.core.UaException;
import org.eclipse.milo.opcua.stack.core.types.builtin.DataValue;
import org.eclipse.milo.opcua.stack.core.types.builtin.NodeId;
import org.eclipse.milo.opcua.stack.core.types.builtin.Variant;
import org.eclipse.milo.opcua.stack.core.types.enumerated.DataChangeTrigger;
import org.eclipse.milo.opcua.stack.core.types.enumerated.TimestampsToReturn;
import org.eclipse.milo.opcua.stack.core.types.structured.CallMethodRequest;
import org.springframework.stereotype.Component;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

@Component
public class OpcuaClient {

    private OpcUaClient client;

    public OpcuaClient() throws Exception {
        this.client = OpcUaClient.create("opc.tcp://84.234.235.118:4840/freeopcua/server",
                endpoints ->
                        endpoints.stream()
                                .findFirst(),
                configBuilder ->
                        configBuilder.setIdentityProvider(new UsernameProvider("curling", "brais"))
                                .build());
    }

    @PostConstruct
    public void connect() throws Exception {
        client.connect().get();
    }
    @PreDestroy
    public void disconnect() throws Exception {
        client.disconnect().get();
    }


    // Change to read(PLC_TAG.TEMP1)
    public String read(PLC_TAG tag) throws ExecutionException, InterruptedException {
        DataValue dataValue = client.readValue(0.0, TimestampsToReturn.Both, tag.getNodeId()).get();
        // First getValue() gets the variant, second getValue() gets the actual value
        return  dataValue.getValue().getValue().toString();
    }

    public StatusHall readAll() throws ExecutionException, InterruptedException {

        double bigLane_track_4_temp_end =
                (double) client.readValue(0.0, TimestampsToReturn.Both, PLC_TAG.BIGLANE_TRACK_4_TEMP_END.getNodeId())
                        .get().getValue().getValue();
        double bigLane_track_4_temp_mid =
                (double) client.readValue(0.0, TimestampsToReturn.Both, PLC_TAG.BIGLANE_TRACK_4_TEMP_MID.getNodeId())
                .get().getValue().getValue();
        double smallLane_track_1_temp_end =
                (double) client.readValue(0.0, TimestampsToReturn.Both, PLC_TAG.SMALLLANE_TRACK_1_TEMP_END.getNodeId())
                .get().getValue().getValue();
        double smallLane_track_1_temp_mid =
                (double) client.readValue(0.0, TimestampsToReturn.Both, PLC_TAG.SMALLLANE_TRACK_1_TEMP_MID.getNodeId())
                .get().getValue().getValue();

        double hall_temp = (double) client.readValue(0.0, TimestampsToReturn.Both, PLC_TAG.HALL_TEMP.getNodeId()).get().getValue().getValue();
        double hall_humidity = (double) client.readValue(0.0, TimestampsToReturn.Both, PLC_TAG.HALL_HUMIDITY.getNodeId()).get().getValue().getValue();
        //double glycol_out_temp = (double) client.readValue(0.0, TimestampsToReturn.Both, PLC_TAG.GLYCOL_OUT_TEMP.getNodeId()).get().getValue().getValue();
        //double glycol_in_temp = (double) client.readValue(0.0, TimestampsToReturn.Both, PLC_TAG.GLYCOL_IN_TEMP.getNodeId()).get().getValue().getValue();
        //double pressure_cond = (double) client.readValue(0.0, TimestampsToReturn.Both, PLC_TAG.PRESSURE_COND.getNodeId()).get().getValue().getValue();



        //return values;
        return new StatusHall(
                bigLane_track_4_temp_end,
                bigLane_track_4_temp_mid,
                smallLane_track_1_temp_end,
                smallLane_track_1_temp_mid,
                hall_temp,hall_humidity);
    }

    public void write(PLC_TAG tag, Variant variant) throws ExecutionException, InterruptedException {
        client.writeValue(tag.getNodeId(),new DataValue(variant)).get();
    }


    // call("write", ["smallLane_setTemp", -4.3])
    public void call(String methodName, String instruction, double value) {
        Variant[] args = {new Variant(instruction), new Variant(value) };
        CallMethodRequest callMethodRequest = new CallMethodRequest(
                new NodeId(2,methodName),
                new NodeId(2, methodName),
                args
        );

        client.call(callMethodRequest);
    }



}
