package com.example.minimes.controller;

import com.example.minimes.model.StatusHall;
import com.example.minimes.model.experiment.*;
import com.example.minimes.opcua.OpcuaClient;
import com.example.minimes.repository.*;
import com.example.minimes.service.externalapi.ElectricityPriceAPI;
import com.example.minimes.service.externalapi.MyYrService;
import com.example.minimes.model.externalapi.PowerPrice;
import com.example.minimes.model.externalapi.WeatherData;
import com.example.minimes.service.externalapi.PowerUsageService;
import com.example.minimes.service.mode.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.*;
import java.util.*;

@RestController
@CrossOrigin("*")
public class Controller {

    @Autowired
    ElectricityPriceAPI electricityPriceAPI;
    @Autowired
    MyYrService myYrService;
    @Autowired
    OpcuaClient opcuaClient;
    @Autowired
    PowerUsageService powerUsageService;
    @Autowired
    ExperimentRepository experimentRepository;

    @Autowired
    TestDatesRepository testDatesRepository;
    @Autowired
    TestRepository testRepository;

    @Autowired
    ScheduleRepository scheduleRepository;
    @Autowired
    ScheduleService scheduleService;
    @Autowired
    private TestService testService;
    @Autowired
    private TestDatesService testDatesService;

    @Autowired
    private InfluxDbService influxDbService;

    public Controller() {
        try {
            //Create a new instance of the Opcua client
            this.opcuaClient = new OpcuaClient();
        } catch (Exception e) {
            opcuaClient = null;
        }
    }

    //This will get the measurements from the PLC and put it into the Measurement class.
    // It will also get the powerdata from the API and put it into the PowerUsageData class.
    //Lastly it will save the experiment in the database, because of the Cascade type,
    // it will automatically update all other tables.
    @GetMapping("/getResult")
    public ResponseEntity<Experiment> getResult(Long experimentID) {
        try {
            Experiment experiment = experimentRepository.getReferenceById(experimentID);
            //Make a list of all tests in our experiment
            List<Test> testList = experiment.getTests();
            //Make a list of all testIterations in our experiment
            List<TestDates> testDatesList = testService.getTestDates(testList);
            //Make a list of DateTimes when the test is starting
            List<LocalDateTime> startDateTimeList = testDatesService.getStartLocalDateTimes(testDatesList);
            //Make a list of DateTimes when the test is ending
            List<LocalDateTime> endDateTimeList = testDatesService.getEndLocalDateTimes(testDatesList);
            //Adds the power data from the API
            testDatesList = testDatesService.addPowerData(testDatesList, startDateTimeList, endDateTimeList);
            //Adds the measurement data from Influx DB
            testDatesList = influxDbService.addMeasurementData(testDatesList, startDateTimeList, endDateTimeList);

            experimentRepository.save(experiment);

            return new ResponseEntity<>(experimentRepository.getReferenceById(experimentID), HttpStatus.OK);
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }


    }

    @GetMapping("/status")
    public StatusHall opctest() throws Exception {
        return opcuaClient.readAll();
    }

    //Gets the weather data from Yr API
    @GetMapping("/yr")
    public List<WeatherData> getYr() {
        return myYrService.someRestCall();
    }

    @GetMapping("/api")
    public List<PowerPrice> getApi() {
        return electricityPriceAPI.getElectricityPrices("2024-04-10T12:00:00", "2024-04-10T17:00:00");
    }

    //Creates a schedule where instructions will automatically be sent to a database
    @GetMapping("schedule")
    public ResponseEntity<List<Schedule>> getSchedule(Long experimentID) {
        try {
            Experiment experiment = experimentRepository.getReferenceById(experimentID);
            return new ResponseEntity<>(scheduleService.addTask(experiment), HttpStatus.OK);
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    //Gets the measurement and power data for the last week.
    @GetMapping("weekStatus")
    public StatusData getMeasurements() {
        LocalDateTime now = LocalDateTime.of(LocalDate.now(), LocalTime.of(LocalTime.now().getHour(), LocalTime.now().getMinute()));
        LocalDateTime oneWeekAgo = now.minusDays(7);
        List<MeasurementDTO> measurementDTOList = influxDbService.fetchDataForLastWeek(oneWeekAgo, now);
        List<PowerUsageDataDTO> powerUsageDataDTOList = powerUsageService.getCompressorsPowerUsage(oneWeekAgo.toString(), now.toString());

        List<PowerUsageDTO> powerUsageDTOList = new ArrayList<>();
        for(PowerUsageDataDTO powerUsageDataDTO : powerUsageDataDTOList) {
            PowerUsageDTO powerUsageDTO = new PowerUsageDTO();
            powerUsageDTO.setStart(powerUsageDataDTO.getStart().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime());
            powerUsageDTO.setEnd(powerUsageDataDTO.getEnd().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime());
            powerUsageDTO.setValue(powerUsageDataDTO.getValue());
            powerUsageDTO.setElectricityPrice(powerUsageDataDTO.getElectricityPrice());
            powerUsageDTOList.add(powerUsageDTO);
        }
        return new StatusData(measurementDTOList, powerUsageDTOList);
    }
}


