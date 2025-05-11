package com.equoterapia.web.authentication.DTOs;

import com.equoterapia.web.entities.enums.Genders;
import com.equoterapia.web.entities.enums.Roles;

import java.time.LocalDate;

public record RegisterDTO(String name, String username, LocalDate birthDate, String password, String cpf, String email, String phone, String address, Genders gender, Roles role, String regNumber) {
}
