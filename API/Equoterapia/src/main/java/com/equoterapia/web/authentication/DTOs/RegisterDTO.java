package com.equoterapia.web.authentication.DTOs;

import com.equoterapia.web.entities.enums.Genders;
import com.equoterapia.web.entities.enums.Roles;

import java.time.LocalDate;

public record RegisterDTO(String name, String username, LocalDate birthDate, String password, String cpf, String email, String phone, String address, Genders gender, Roles role, String regNumber) {
}

// DTO utilizado para transportar os dados necessários para o registro de um novo usuário.
// Utiliza Java Record para simplificar a criação de classes imutáveis.
// Contém informações pessoais e de autenticação, como nome, username, senha, CPF, email, telefone, endereço, gênero, papel (role) e número de registro.