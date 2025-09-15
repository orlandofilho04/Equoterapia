package com.equoterapia.web.repositories;

import com.equoterapia.web.entities.Horse;
import com.equoterapia.web.entities.enums.HorsesStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

// Repositório para operações com a entidade Horse (cavalo)
public interface HorseRepository extends JpaRepository<Horse, Long> {
    // Busca todos os cavalos por status (ativo, inativo, etc.)
    List<Horse> findAllByStatus(HorsesStatus status);
}