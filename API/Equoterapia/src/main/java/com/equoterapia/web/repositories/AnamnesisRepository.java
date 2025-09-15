package com.equoterapia.web.repositories;

import com.equoterapia.web.entities.Anamnesis;
import org.springframework.data.jpa.repository.JpaRepository;

// Repositório para operações com a entidade Anamnesis (anamnese)
public interface AnamnesisRepository extends JpaRepository<Anamnesis, Long> {
}
