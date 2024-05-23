package com.example.minimes.repository;

import com.example.minimes.model.experiment.Experiment;
import com.example.minimes.model.experiment.Measurement;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MeasurementRepository extends JpaRepository<Measurement, Long> {
}
