package com.example.minimes.service.mode;

import com.example.minimes.model.experiment.*;
import com.example.minimes.opcua.OpcuaClient;
import com.example.minimes.repository.ScheduleRepository;
import org.eclipse.milo.opcua.stack.core.types.builtin.Variant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Service
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;

    @Autowired
    public ScheduleService(ScheduleRepository scheduleRepository) {
        this.scheduleRepository = scheduleRepository;
    }

    @Autowired
    OpcuaClient opcuaClient;

    //This will handle scheduling
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    //This will go through an experiment and find all dates for the tests. It will then
    //create a schedule object with the data and add it to a list
    public List<Schedule> addTask(Experiment experiment) {
        List<Schedule> scheduleList = new ArrayList<>();
        for (Test test : experiment.getTests()) {
            for (Instructions instructions : test.getInstructions()) {
                for (TestDates testDates : test.getTestDates()) {
                    Schedule schedule = new Schedule();

                    schedule.setIceTempBigLane(instructions.getIceTempBigLane());
                    schedule.setIceTempSmallLane(instructions.getIceTempSmallLane());
                    schedule.setGlycolTemp(instructions.getGlycolTemp());

                    LocalTime time = LocalTime.parse(instructions.getStartTime(), DateTimeFormatter.ofPattern("H:mm:ss"));
                    LocalDateTime startTime = LocalDateTime.of(testDates.getDate(), time);
                    schedule.setStartTime(startTime);
                    scheduleList.add(schedule);
                }
            }
        }

        //Sort the list by the start time
        scheduleList.sort(Comparator.comparing(Schedule::getStartTime));
        for (Schedule schedule : scheduleList) {
            //This will
            scheduleTask(schedule);
        }
        return scheduleList;
    }

   /* public void removeTask(String taskId) {
        scheduleRegistry.remove(taskId);
    }*/

    private void scheduleTask(Schedule schedule) {
        long delay = LocalDateTime.now().until(schedule.getStartTime(), TimeUnit.SECONDS.toChronoUnit());
        //System.out.println(delay);
        //This will handle when the calls to the opcuaClient is made. When the time is correct it will run the function
        //and save it to a database located on the opcua server
        scheduler.schedule(() -> {
            System.out.println("Sender kommandoer til pls");
            opcuaClient.call("WriteFunc", "PIDE_Four_Valve_control", schedule.getIceTempBigLane());
            opcuaClient.call("WriteFunc", "PIDE_Two_Valve_control", schedule.getIceTempSmallLane());
            opcuaClient.call("WriteFunc", "Glycol_Setvalue", schedule.getGlycolTemp());
            // opcuaClient.call("func", "setIceTemp.",schedule.getBigLaneIceTemp)
            scheduleRepository.save(schedule);

        }, delay, TimeUnit.SECONDS);
    }
}