package com.equoterapia.web.repositories;

import com.equoterapia.web.entities.Professional;
import com.equoterapia.web.entities.enums.Roles;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProfessionalRepository extends JpaRepository<Professional, Long> {
    UserDetails findByUsername(String username);

    Professional findProfessionalByUsername(String username);

    List<Professional> findProfessionalByRole(Roles role);

    Boolean existsProfessionalByUsername(String username);
}
