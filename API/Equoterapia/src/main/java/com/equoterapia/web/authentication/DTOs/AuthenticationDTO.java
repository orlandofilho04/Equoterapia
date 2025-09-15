package com.equoterapia.web.authentication.DTOs;

// DTO utilizado para transportar os dados de autenticação (login) do usuário.
// Utiliza Java Record para simplificar a criação de classes imutáveis.
// Contém apenas os campos necessários para autenticação: username e password.
public record AuthenticationDTO(String username, String password) {
}
