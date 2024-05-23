package com.example.minimes.service.mode;

import com.example.minimes.model.experiment.Experiment;
import com.example.minimes.model.experiment.Test;
import com.example.minimes.repository.ExperimentRepository;
import com.example.minimes.repository.InstructionRepository;
import com.example.minimes.repository.TestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExperimentService {
    private final ExperimentRepository experimentRepository;

    private final TestRepository testRepository;
    private final InstructionRepository instructionRepository;

    @Autowired
    public ExperimentService(ExperimentRepository experimentRepository, TestRepository testRepository, InstructionRepository instructionRepository) {
        this.experimentRepository = experimentRepository;
        this.testRepository = testRepository;
        this.instructionRepository = instructionRepository;
    }

    public Experiment saveExperiemnt(Experiment experiment) {
        return experimentRepository.save(experiment);
    }

    public List<Experiment> findAllExperiments() {
        return experimentRepository.findAll();
    }

    public Experiment findExperiment(Experiment experiment) {
        return experimentRepository.getReferenceById((long) experiment.getId());
    }

    public Experiment findExperimentByID(Long id) {
        return experimentRepository.getReferenceById(id);
    }

    public List<Test> findAllTestsInExperiment(Experiment experiment) {
        return experiment.getTests();
    }

    public ResponseEntity<Void> deleteExperiment(Experiment experiment) {
        try {
            experimentRepository.delete(experiment);
            return ResponseEntity.status(HttpStatusCode.valueOf(200)).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatusCode.valueOf(500)).build();
        }
    }
}


