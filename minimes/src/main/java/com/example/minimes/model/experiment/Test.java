package com.example.minimes.model.experiment;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import org.springframework.data.relational.core.sql.In;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;


@Entity
@JsonIgnoreProperties(value = {"hibernateLazyInitializer", "handler"}, ignoreUnknown = true)
public class Test {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(nullable = false)
    private String title;
    private LocalTime endTime;
    private String endTimeHours;
    private String endTimeMinutes;
    private LocalTime startTime;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "experiment_id")
    @JsonIgnore
    private Experiment experiment;

    @OneToMany(mappedBy = "test", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    private Collection<Instructions> instructions;

    @OneToMany(mappedBy = "test", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private Collection<TestDates> testDates;

    public Test(Experiment experiment, String title, String endTimeMinutes, String endTimeHours, Date endTime, Collection<Instructions> instructions, Collection<TestDates> testDates) {
        this.experiment = experiment;
        this.title = title;
        this.endTimeHours = endTimeHours;
        this.endTimeMinutes = endTimeMinutes;

        if (instructions == null) {
            this.instructions = new HashSet<>();
        } else {
            this.instructions = instructions;
        }
        if (testDates == null) {
            this.testDates = new HashSet<>();
        } else {
            this.testDates = testDates;
        }

    }

    public Test() {

    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public Experiment getExperiment() {
        return experiment;
    }

    public void setExperiment(Experiment experiment) {
        this.experiment = experiment;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public LocalTime getEndTime() {
        setEndTime();
        return this.endTime;
    }
    public void setEndTime() {
        this.endTime = LocalTime.parse(this.endTimeHours+":"+this.endTimeMinutes, DateTimeFormatter.ofPattern("H:mm"));
        }


    public void setEndTime(String endTime) {
        System.out.println(this.endTimeHours+":"+this.endTimeMinutes);
        if (!(endTime.isEmpty())) {
            this.endTime = LocalTime.parse(endTime, DateTimeFormatter.ofPattern("H:mm:ss"));
        }
    }


    public String getEndTimeHours() {
        return endTimeHours;
    }

    public void setEndTimeHours(String endTimeHours) {
        this.endTimeHours = endTimeHours;
    }

    public String getEndTimeMinutes() {
        return endTimeMinutes;
    }

    public void setEndTimeMinutes(String endTimeMinutes) {
        this.endTimeMinutes = endTimeMinutes;
    }

    public Collection<Instructions> getInstructions() {
        return instructions;
    }

    public void setInstructions(Collection<Instructions> instructions) {
        for (int i = 0; i < instructions.size(); i++) {
            instructions.stream().toList().get(i).setTest(this);
        }
        this.instructions = instructions;
    }

    public Collection<TestDates> getTestDates() {
        return testDates;
    }

    public void setTestDates(Collection<TestDates> testDates) {

        for (int i = 0; i < testDates.size(); i++) {
            testDates.stream().toList().get(i).setTest(this);
            //testDates.get(i).setTest(this);
        }

        this.testDates = testDates;
    }

    public void removeTestDates() {
        this.testDates = new HashSet<>();
    }

    public void setStartTime() {
        Collection<Instructions> instructionsList = this.getInstructions();
        for (Instructions instructions : instructionsList) {
            this.startTime = LocalTime.parse(
                        instructions.getStartTimeHours()+":"
                            +instructions.getStartTimeMinutes(),
                            DateTimeFormatter.ofPattern("H:mm"));
            break;
        }
    }
    //Fiks denne!
    public LocalTime getStartTime() {
        if(this.startTime == null){
            setStartTime();
        }
        return this.startTime;
    }
}
