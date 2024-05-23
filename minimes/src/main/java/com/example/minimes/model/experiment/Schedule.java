package com.example.minimes.model.experiment;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
public class Schedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long id;
    private LocalDateTime startTime;
    private Double iceTempBigLane;
    private Double iceTempSmallLane;
    private Double glycolTemp;

    public Schedule(LocalDateTime startTime, Double iceTempBigLane, Double iceTempSmallLane, Double glycolTemp) {
        this.startTime = startTime;
        this.iceTempBigLane = iceTempBigLane;
        this.iceTempSmallLane = iceTempSmallLane;
        this.glycolTemp = glycolTemp;
    }
    public Schedule() {}

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public Double getIceTempBigLane() {
        return iceTempBigLane;
    }

    public void setIceTempBigLane(Double iceTempBigLane) {
        this.iceTempBigLane = iceTempBigLane;
    }

    public Double getIceTempSmallLane() {
        return iceTempSmallLane;
    }

    public void setIceTempSmallLane(Double iceTempSmallLane) {
        this.iceTempSmallLane = iceTempSmallLane;
    }

    public Double getGlycolTemp() {
        return glycolTemp;
    }

    public void setGlycolTemp(Double glycolTemp) {
        this.glycolTemp = glycolTemp;
    }
}
