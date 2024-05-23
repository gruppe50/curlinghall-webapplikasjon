package com.example.minimes.repository;

import com.example.minimes.model.experiment.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
}
