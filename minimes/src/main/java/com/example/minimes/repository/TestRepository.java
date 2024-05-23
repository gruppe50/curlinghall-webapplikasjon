package com.example.minimes.repository;

import com.example.minimes.model.experiment.Experiment;
import com.example.minimes.model.experiment.Test;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestRepository extends JpaRepository<Test, Long> {
    List<Test> findByExperiment(@Param("experiment")Experiment experiment);
}
