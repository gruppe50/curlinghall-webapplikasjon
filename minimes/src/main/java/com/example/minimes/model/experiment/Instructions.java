package com.example.minimes.model.experiment;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@JsonIgnoreProperties(ignoreUnknown=true)
public class Instructions {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

   // @JsonFormat(pattern = "HH:mm:ss")
    private String startTime;
    private String startTimeHours;
    private String startTimeMinutes;

    @Column(name = "set_temp_big_lane")
    private double iceTempBigLane;
    @Column(name = "set_temp_small_lane")
    private double iceTempSmallLane;
    @Column(name = "set_glycol_temp")
    private double glycolTemp;
    @Column(name = "set_flow_pump")
    private double setFlowPump;

    @ManyToOne
    @JoinColumn(name = "test_id")
    @JsonIgnore
    private Test test;


    public Instructions(String startTimeHours, String startTimeMinutes, double iceTempBigLane, double iceTempSmallLane, double glycolTemp, double setFlowPump) {
        this.startTimeHours = startTimeHours;
        this.startTimeMinutes = startTimeMinutes;
        this.iceTempBigLane = iceTempBigLane;
        this.iceTempSmallLane = iceTempSmallLane;
        this.glycolTemp = glycolTemp;
        this.setFlowPump = setFlowPump;
    }


    public Instructions(){}

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getStartTime() {
        if(!(startTime.isEmpty())){
            return startTime;
        }
        return startTimeHours+":"+startTimeMinutes;
    }

    public void setStartTime() {
        this.startTime = this.startTimeHours+":"+this.startTimeMinutes;
    }


    public double getIceTempBigLane() {
        return iceTempBigLane;
    }

    public void setIceTempBigLane(double setIceTempBigLane) {
        this.iceTempBigLane = setIceTempBigLane;
    }

    public double getIceTempSmallLane() {
        return iceTempSmallLane;
    }

    public void setIceTempSmallLane(double setIceTempSmallLane) {
        this.iceTempSmallLane = setIceTempSmallLane;
    }

    public double getGlycolTemp() {
        return glycolTemp;
    }

    public void setGlycolTemp(double glycolTemp) {
        this.glycolTemp = glycolTemp;
    }

    public double getSetFlowPump() {
        return setFlowPump;
    }

    public void setSetFlowPump(double setFlowPump) {
        this.setFlowPump = setFlowPump;
    }

    public String getStartTimeHours() {
        return startTimeHours;
    }

    public void setStartTimeHours(String startTimeHours) {
        this.startTimeHours = startTimeHours;
    }

    public String getStartTimeMinutes() {
        return startTimeMinutes;
    }

    public void setStartTimeMinutes(String startTimeMinutes) {
        this.startTimeMinutes = startTimeMinutes;
    }

    public Test getTest() {
        return test;
    }

    public void setTest(Test test) {
        this.test = test;
    }
}

