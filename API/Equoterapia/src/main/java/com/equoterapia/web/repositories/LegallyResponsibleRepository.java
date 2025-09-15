
package com.equoterapia.web.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.equoterapia.web.entities.LegallyResponsible;

import java.util.Optional;

// Repositório para operações com a entidade LegallyResponsible (responsável legal)
public interface LegallyResponsibleRepository extends JpaRepository<LegallyResponsible, Long>{
    // Busca um responsável legal pelo CPF
    public Optional<LegallyResponsible> findLegallyResponsibleByCpf(String cpf);
}
