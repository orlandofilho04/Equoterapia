package com.equoterapia.web.repositories;

import com.equoterapia.web.entities.Horse;
import com.equoterapia.web.entities.enums.HorsesStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HorseRepository extends JpaRepository<Horse, Long> {
    List<Horse> findAllByStatus(HorsesStatus status);
}