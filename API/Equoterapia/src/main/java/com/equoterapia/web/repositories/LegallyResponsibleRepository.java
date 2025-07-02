
package com.equoterapia.web.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.equoterapia.web.entities.LegallyResponsible;

import java.util.Optional;

public interface LegallyResponsibleRepository extends JpaRepository<LegallyResponsible, Long>{
    public Optional<LegallyResponsible> findLegallyResponsibleByCpf(String cpf);
}
