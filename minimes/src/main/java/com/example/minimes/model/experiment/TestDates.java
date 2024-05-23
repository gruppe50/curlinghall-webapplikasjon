package com.example.minimes.model.experiment;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.util.Collection;
import java.util.Date;

@Entity
public class TestDates {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "test_id")
    @JsonIgnore
    private Test test;

    private LocalDate date;

    @OneToMany(mappedBy = "testDates", cascade = CascadeType.ALL)
    private Collection<PowerUsage> powerUsage;

    @OneToMany(mappedBy = "testDates", cascade = CascadeType.ALL)
    private Collection<Measurement> measurement;

    public TestDates(String date) {
        this.date = LocalDate.parse(date, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
    }

    public TestDates() {
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public Test getTest() {
        return test;
    }

    public void setTest(Test test) {
        this.test = test;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Collection<PowerUsage> getPowerUsage() {
        return powerUsage;
    }

    public void setPowerUsage(Collection<PowerUsage> powerUsage) {
        this.powerUsage = powerUsage;
    }



    public Collection<Measurement> getMeasurement() {
        return measurement;
    }

    public void setMeasurement(Collection<Measurement> measurement) {
        this.measurement = measurement;
    }


}