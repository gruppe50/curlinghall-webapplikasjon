package com.example.minimes.service.mode;

import com.example.minimes.model.experiment.Experiment;
import com.example.minimes.model.experiment.Test;
import com.example.minimes.model.experiment.TestDates;
import com.example.minimes.repository.ExperimentRepository;
import com.example.minimes.repository.TestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TestService {
    private final TestRepository testRepository;

    @Autowired
    public TestService(TestRepository testRepository) {
        this.testRepository = testRepository;
    }

    //Saves a test
    public Test saveTest(Test test) {
        try {
            return testRepository.save(test);
        } catch (Exception e) {
            throw new DataIntegrityViolationException("Feil i saveTest");
        }
    }

        public List<Test> getAllTests() {
        return testRepository.findAll();
    }

   /* public Test findTest(long id) {
        System.out.println("ID = " + id);
        System.out.println(testRepository.getReferenceById(id).toString());
        return testRepository.getReferenceById(id);
    }

    public List<Test> findAllTestsInExperiment(Experiment experiment){
        return testRepository.findByExperiment(experiment);
    }
*/
    public List<TestDates> getTestDates(List<Test> tests){
        List<TestDates> testDatesList = new ArrayList<>();
        for(Test test : tests){
            testDatesList.addAll(test.getTestDates());
        }
        return testDatesList;
    }

}