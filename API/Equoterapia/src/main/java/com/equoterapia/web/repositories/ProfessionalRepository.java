package com.equoterapia.web.repositories;

import com.equoterapia.web.entities.Professional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfessionalRepository extends JpaRepository<Professional, Long> {
    UserDetails findByUsername(String username);
}
