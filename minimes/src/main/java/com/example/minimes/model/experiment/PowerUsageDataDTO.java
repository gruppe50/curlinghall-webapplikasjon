package com.example.minimes.model.experiment;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.cglib.core.Local;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@JsonIgnoreProperties(ignoreUnknown=true)

public class PowerUsageDataDTO {

    @JsonProperty("Start")
    private Date start;
    @JsonProperty("End")
    private Date end;
    @JsonProperty("Value")
    private double value;
    private double electricityPrice;

    public PowerUsageDataDTO(Date start, Date end, double value) {
        this.start = start;
        this.end = end;
        this.value = value;
    }

    public PowerUsageDataDTO() {
    }

    public PowerUsageDataDTO(PowerUsageDataDTO p1, PowerUsageDataDTO p2) {
        this.start = p1.start;
        this.end = p1.end;
        this.value = p1.getValue() + p2.getValue();
    }

    public Date getStart() {
        return start;
    }

    public void setStart(Date start) {
        this.start = start;
    }

    public Date getEnd() {
        return end;
    }

    public void setEnd(Date end) {
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