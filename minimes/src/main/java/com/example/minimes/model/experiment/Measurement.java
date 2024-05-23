package com.example.minimes.model.experiment;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jdk.jfr.Enabled;

import java.time.LocalTime;

@Entity
public class Measurement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private LocalTime time;
    private double bigLaneIceTemp;
    private double smallLaneIceTemp;
    private double hallTemp;
    private double humidity;
    private double glycolTemp;

    @ManyToOne
    @JsonIgnore
    private TestDates testDates;

    public Measurement(LocalTime time, double bigLaneIceTemp, double smallLaneIceTemp, double hallTemp, double humidity, TestDates testDates, double glycolTemp) {
        this.time = time;
        this.bigLaneIceTemp = bigLaneIceTemp;
        this.smallLaneIceTemp = smallLaneIceTemp;
        this.hallTemp = hallTemp;
        this.humidity = humidity;
        this.testDates = testDates;
        this.glycolTemp = glycolTemp;
    }
    public Measurement() {}

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public LocalTime getTime() {
        return time;
    }

    public void setTime(LocalTime time) {
        this.time = time;
    }

    public double getBigLaneIceTemp() {
        return bigLaneIceTemp;
    }

    public void setBigLaneIceTemp(double bigLaneIceTemp) {
        this.bigLaneIceTemp = bigLaneIceTemp;
    }

    public double getSmallLaneIceTemp() {
        return smallLaneIceTemp;
    }

    public void setSmallLaneIceTemp(double smallLaneIceTemp) {
        this.smallLaneIceTemp = smallLaneIceTemp;
    }

    public double getHallTemp() {
        return hallTemp;
    }

    public void setHallTemp(double hallTemp) {
        this.hallTemp = hallTemp;
    }

    public double getHumudity() {
        return humidity;
    }

    public void setHumudity(double humudity) {
        this.humidity = humudity;
    }

    public TestDates getTestDates() {
        return testDates;
    }

    public void setTestDates(TestDates testDates) {
        this.testDates = testDates;
    }

    public double getHumidity() {
        return humidity;
    }

    public void setHumidity(double humidity) {
        this.humidity = humidity;
    }

    public double getGlycolTemp() {
        return glycolTemp;
    }

    public void setGlycolTemp(double glycolTemp) {
        this.glycolTemp = glycolTemp;
    }
}
