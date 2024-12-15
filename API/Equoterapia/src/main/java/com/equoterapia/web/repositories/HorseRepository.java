package com.equoterapia.web.repositories;

import com.equoterapia.web.entities.Horse;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HorseRepository extends JpaRepository<Horse, Long> {
  
}