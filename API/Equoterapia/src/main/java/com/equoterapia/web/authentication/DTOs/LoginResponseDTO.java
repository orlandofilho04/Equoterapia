package com.equoterapia.web.authentication.DTOs;

import com.equoterapia.web.entities.enums.Roles;

public record LoginResponseDTO(String token, String username, String name, Boolean isAdmin, Roles role) {
}
// DTO utilizado para transportar a resposta do login para o cliente.
// Utiliza Java Record para simplificar a criação de classes imutáveis.
// Contém o token de autenticação, username, nome do usuário, flag indicando se é admin e o papel (role).