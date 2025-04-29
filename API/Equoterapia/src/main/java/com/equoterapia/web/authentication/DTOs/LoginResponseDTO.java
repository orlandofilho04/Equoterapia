package com.equoterapia.web.authentication.DTOs;

public record LoginResponseDTO(String token, String username, String name, Boolean isAdmin) {
}
