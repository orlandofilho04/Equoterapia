package com.equoterapia.web.repositories;

import com.equoterapia.web.entities.Administrator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
// Repositório para operações com a entidade Administrator (administrador)
public interface AdministratorRepository extends JpaRepository<Administrator, Long> {
    // Busca um administrador pelo e-mail
    Administrator findByEmail(String email);

    // Busca um administrador pelo CPF
    Administrator findByCpf(String cpf);
}