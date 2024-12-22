package com.equoterapia.web.repositories;

import com.equoterapia.web.entities.Administrator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdministratorRepository extends JpaRepository<Administrator, Long> {
    // You can add custom query methods if needed
    Administrator findByEmail(String email);
    Administrator findByCpf(String cpf);
}