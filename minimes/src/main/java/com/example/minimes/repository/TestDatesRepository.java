package com.example.minimes.repository;

import com.example.minimes.model.experiment.Experiment;
import com.example.minimes.model.experiment.TestDates;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TestDatesRepository extends JpaRepository<TestDates, Long> {

}