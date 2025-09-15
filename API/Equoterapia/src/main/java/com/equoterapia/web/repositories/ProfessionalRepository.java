package com.equoterapia.web.repositories;

import com.equoterapia.web.entities.Professional;
import com.equoterapia.web.entities.enums.Roles;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
// Repositório para operações com a entidade Professional (profissional)
public interface ProfessionalRepository extends JpaRepository<Professional, Long> {
    // Busca um usuário para autenticação pelo username
    UserDetails findByUsername(String username);

    // Busca um profissional pelo username
    Professional findProfessionalByUsername(String username);

    // Busca todos os profissionais por papel (role)
    List<Professional> findProfessionalByRole(Roles role);

    // Verifica se existe um profissional com o username informado
    Boolean existsProfessionalByUsername(String username);
}
