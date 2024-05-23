package com.example.minimes.controller;

import com.example.minimes.model.experiment.*;
import com.example.minimes.repository.ExperimentRepository;
import com.example.minimes.repository.InstructionRepository;
import com.example.minimes.repository.TestRepository;
import com.example.minimes.service.mode.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.*;


// @CrossOrigin("*")
@RestController
public class ExperimentController {

    @Autowired
    private ExperimentRepository experimentRepository;
    @Autowired
    private TestRepository testRepository;

    @Autowired
    private ExperimentService experimentService;
    @Autowired
    private TestService testService;

    @Autowired
    private ScheduleService scheduleService;

    @Autowired
    private InstructionRepository instructionRepository;

    //Find one experiment where we have the ID, if no ID then a new experiment is created?
    @GetMapping("/experiment")
    public ResponseEntity<Experiment> getExperiment(@RequestParam Long id) {
        Optional<Experiment> experiment = experimentRepository.findById(id);
        if(experiment.isEmpty()) {
            return ResponseEntity.status(HttpStatusCode.valueOf(500)).build();
        }
        return new ResponseEntity<>(experiment.get(), HttpStatus.OK);
    }

    //Find one experiment where we the experiment is the parameter
    @PostMapping("/experiment")
    public ResponseEntity<Long> createExperiment(@RequestBody Experiment experiment) {
        try {
            Experiment newExperiment = experimentService.saveExperiemnt(experiment);
            return new ResponseEntity<>(newExperiment.getId(), HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    //Delete one experiment
    @DeleteMapping("/deleteExperiment")
        public ResponseEntity<Void> deleteExperiment(long id){
            try{
                Experiment experiment = experimentRepository.getReferenceById(id);
                experimentService.deleteExperiment(experiment);
                return ResponseEntity.status(HttpStatusCode.valueOf(200)).build();

            }catch (Exception e){
                return ResponseEntity.status(HttpStatusCode.valueOf(500)).build();
            }
    }

    //Saves a test and the instructions, needs to get the test and the experiment ID as parameters
    @PostMapping("/test")
    public ResponseEntity<?> saveTest(@RequestBody Test test, @RequestParam long id) {
        Experiment experiment = null;
        try {
            experiment = experimentService.findExperiment(experimentRepository.getReferenceById(id));
        }
        catch(Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("The experiment could not be found");
        }
        try {
            //Add the test to the experiment
            experiment.addTest(test);
            //Save the updated experiment in the database
            experimentService.saveExperiemnt(experiment);
            return ResponseEntity.ok(test.getId());
        } catch (DataIntegrityViolationException e) {
            // Handle duplicate key violation
            System.out.println("Data integrity violation");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Duplicate test title. Please use a unique title.");
        } catch (Exception e) {
            // Handle other exceptions
            System.out.println("Error occurred while saving test: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while saving the test.");
        }
    }

    //List all experiments
    @GetMapping("/findAllExperiments")
    public ResponseEntity<List<Experiment>> findAllExperiments() {
        try {
            List<Experiment> experimentList = experimentService.findAllExperiments();
            return new ResponseEntity<>(experimentList, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/findAllTestsInExperiment")
    public ResponseEntity<List<Test>> findAllTestsInExperiment(Experiment experiment) {
        try{
            List<Test> testList = experimentService.findAllTestsInExperiment(experiment);
            return new ResponseEntity<>(testList, HttpStatus.OK);
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
