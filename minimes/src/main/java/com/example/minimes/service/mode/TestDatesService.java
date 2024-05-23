package com.example.minimes.service.mode;

import com.example.minimes.model.experiment.PowerUsage;
import com.example.minimes.model.experiment.PowerUsageDataDTO;
import com.example.minimes.model.experiment.TestDates;
import com.example.minimes.repository.TestDatesRepository;
import com.example.minimes.service.externalapi.PowerUsageService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

@Service
public class TestDatesService {
    private final PowerUsageService powerUsageService;

    public TestDatesService(PowerUsageService powerUsageService) {
        this.powerUsageService = powerUsageService;
    }


    public List<LocalDateTime> getStartLocalDateTimes(List<TestDates> testDatesList) {
        List<LocalDateTime> dateListStart = new ArrayList<>();

        for (TestDates testDates : testDatesList) {
            LocalTime startTime = testDates.getTest().getStartTime();
            LocalDate dateStart = testDates.getDate();
            LocalDateTime fullDateTimeStart = LocalDateTime.of(dateStart, startTime);
            dateListStart.add(fullDateTimeStart);
        }
        return dateListStart;
    }

    //Make a list of LocalDateTime from our testDates
    public List<LocalDateTime> getEndLocalDateTimes(List<TestDates> testDatesList) {
        List<LocalDateTime> dateListEnd = new ArrayList<>();

        for (TestDates testDates : testDatesList) {
            LocalTime startTime = testDates.getTest().getStartTime();
            LocalTime endTime = testDates.getTest().getEndTime();
            LocalDate endDate = testDates.getDate();

            if (endTime.isBefore(startTime) || endTime.equals(startTime)) {
                endDate = endDate.plusDays(1);
            }
            dateListEnd.add(LocalDateTime.of(endDate, endTime));
        }
        return dateListEnd;
    }

    //This will add powerUsageData into our testDates objects
    public List<TestDates> addPowerData(List<TestDates> testDatesList, List<LocalDateTime> startDateTimeList, List<LocalDateTime> endDateTimeList) {

        for(int i = 0; i<startDateTimeList.size(); i++) {
            //Gets the powerdata from the API between the start and end date of our testDates objects.
            List<PowerUsageDataDTO> powerUsageDataDTOList = powerUsageService.getCompressorsPowerUsage(startDateTimeList.get(i).toString(), endDateTimeList.get(i).toString());
            //Need to remove the last object in the list. Because the API gets the data "from the last hour + 1"
            powerUsageDataDTOList.removeLast();

            for(TestDates testDates : testDatesList) {
                if(testDates.getDate().equals(startDateTimeList.get(i).toLocalDate())){
                    //Puts the powerdata into our testDates objects
                    testDates.setPowerUsage(makePowerUsageObjects(powerUsageDataDTOList, testDates));
                    }
                }
            }
        return testDatesList;
    }

    //Adds attributes to our powerUsage objects
    private List<PowerUsage> makePowerUsageObjects(List<PowerUsageDataDTO> powerUsageDataDTOList, TestDates testDates) {
        List<PowerUsage> powerUsageList = new ArrayList<>();

        for (PowerUsageDataDTO powerUsageDataDTO : powerUsageDataDTOList) {
            PowerUsage powerUsage = new PowerUsage();
            //Needs to convert to correct timezone
            powerUsage.setStartTime(powerUsageDataDTO.getStart().toInstant().atZone(ZoneId.systemDefault()).toLocalTime());
            powerUsage.setEndTime(powerUsageDataDTO.getEnd().toInstant().atZone(ZoneId.systemDefault()).toLocalTime());
            powerUsage.setValue(powerUsageDataDTO.getValue());
            powerUsage.setTestDates(testDates);
            powerUsage.setElectricityPrice(powerUsageDataDTO.getElectricityPrice());
            powerUsageList.add(powerUsage);
    }
        return powerUsageList;
}
}
