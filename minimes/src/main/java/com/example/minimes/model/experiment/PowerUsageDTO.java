package com.example.minimes.model.experiment;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.cglib.core.Local;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@JsonIgnoreProperties(ignoreUnknown=true)

public class PowerUsageDTO {

    @JsonProperty("Start")
    private LocalDateTime start;
    @JsonProperty("End")
    private LocalDateTime end;
    @JsonProperty("Value")
    private double value;
    private double electricityPrice;

    public PowerUsageDTO(LocalDateTime start, LocalDateTime end, double value, double electricityPrice) {
        this.start = start;
        this.end = end;
        this.value = value;
        this.electricityPrice = electricityPrice;
    }

    public PowerUsageDTO() {
    }

    public LocalDateTime getStart() {
        return start;
    }

    public void setStart(LocalDateTime start) {
        this.start = start;
    }

    public LocalDateTime getEnd() {
        return end;
    }

    public void setEnd(LocalDateTime end) {
        this.end = end;
    }

    public double getValue() {
        return value;
    }

    public void setValue(double value) {
        this.value = value;
    }

    public double getElectricityPrice() {
        return electricityPrice;
    }

    public void setElectricityPrice(double electricityPrice) {
        this.electricityPrice = electricityPrice;
    }
}