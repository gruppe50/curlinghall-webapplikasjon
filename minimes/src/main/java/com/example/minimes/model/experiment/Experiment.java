package com.example.minimes.model.experiment;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;


import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;


@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Experiment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(nullable = false)
    private String title;
    private String description;
    @OneToMany(mappedBy = "experiment", cascade=CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Test> tests;


    public Experiment(String title) {
        this.title = title;
        this.description = "";
        this.tests = new ArrayList<>();
    }

    public Experiment(String title, String description, List<Test> tests) {
        this.title = title;
        this.description = description;

        if(tests ==null) {
            this.tests = new ArrayList<>();
        }
        else{
            this.tests = tests;
            }
    }

    public Experiment(String title, String description) {
        this.title = title;
        this.description = description;
    }
    public Experiment(){}

    public long getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
    public List<Test> getTests() {
        return tests;
    }

    public void setTests(List<Test> test) {
        for (Test value : test) {
            value.setExperiment(this);
        }
        this.tests = test;
    }
    public void addTest(Test test){
        if(this.tests ==null){
            this.tests = new ArrayList<>();
        }
        this.tests.add(test);
        test.setExperiment(this);

    }


}
