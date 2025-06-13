package com.equoterapia.web.authentication.DTOs;

import com.equoterapia.web.entities.enums.Roles;

public record LoginResponseDTO(String token, String username, String name, Boolean isAdmin, Roles role) {
}
