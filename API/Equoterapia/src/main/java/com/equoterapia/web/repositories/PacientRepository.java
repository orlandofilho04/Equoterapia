package com.equoterapia.web.repositories;

import com.equoterapia.web.entities.Pacient;
import com.equoterapia.web.entities.enums.PacientStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PacientRepository extends JpaRepository<Pacient, Long> {
    List<Pacient> findAllByStatus(PacientStatus pacientStatus);
}
