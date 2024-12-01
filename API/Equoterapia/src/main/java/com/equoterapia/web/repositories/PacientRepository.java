package com.equoterapia.web.repositories;


import com.equoterapia.web.entities.Pacient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PacientRepository extends JpaRepository<Pacient, Long> {
}
