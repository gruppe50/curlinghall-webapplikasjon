package com.example.minimes.model.experiment;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalTime;

@Entity
public class PowerUsage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private LocalTime startTime;
    private LocalTime endTime;
    private double val;
    private double electricityPrice;

    @JsonIgnore
    @ManyToOne
    private TestDates testDates;

    public PowerUsage(LocalTime startTime, LocalTime endTime, double val) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.val = val;
    }
    public PowerUsage(){
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public double getValue() {
        return val;
    }

    public void setValue(double value) {
        this.val = value;
    }

    public TestDates getTestDates() {
        return testDates;
    }

    public void setTestDates(TestDates testDates) {
        this.testDates = testDates;
    }

    public double getElectricityPrice() {
        return electricityPrice;
    }

    public void setElectricityPrice(double electricityPrice) {
        this.electricityPrice = electricityPrice;
    }
}

