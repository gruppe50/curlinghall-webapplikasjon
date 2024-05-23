package com.example.minimes.model.experiment;

import java.time.LocalDateTime;
import java.util.List;

public class StatusData {

    private List<MeasurementDTO> measurementDTOList;
    private List<PowerUsageDTO> powerUsageDTOList;



    public StatusData(List<MeasurementDTO> measurementDTOList, List<PowerUsageDTO> powerUsageDTOList) {
        this.measurementDTOList = measurementDTOList;
        this.powerUsageDTOList = powerUsageDTOList;
    }

    public List<MeasurementDTO> getMeasurementDTOList() {
        return measurementDTOList;
    }

    public void setMeasurementDTOList(List<MeasurementDTO> measurementDTOList) {
        this.measurementDTOList = measurementDTOList;
    }

    public List<PowerUsageDTO> getPowerUsageDTOList() {
        return powerUsageDTOList;
    }

    public void setPowerUsageDTOList(List<PowerUsageDTO> powerUsageDTOList) {
        this.powerUsageDTOList = powerUsageDTOList;
    }
}

