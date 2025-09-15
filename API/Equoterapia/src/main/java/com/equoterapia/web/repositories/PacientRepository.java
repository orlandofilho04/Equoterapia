package com.equoterapia.web.repositories;

import com.equoterapia.web.entities.Pacient;
import com.equoterapia.web.entities.enums.PacientStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
// Repositório para operações com a entidade Pacient (paciente)
public interface PacientRepository extends JpaRepository<Pacient, Long> {
    // Busca todos os pacientes por status (ativo, inativo, etc.)
    List<Pacient> findAllByStatus(PacientStatus pacientStatus);
}
