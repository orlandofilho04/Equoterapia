package com.equoterapia.web.resources;

import com.equoterapia.web.authentication.DTOs.AuthenticationDTO;
import com.equoterapia.web.authentication.DTOs.LoginResponseDTO;
import com.equoterapia.web.authentication.DTOs.RegisterDTO;
import com.equoterapia.web.authentication.security.TokenService;
import com.equoterapia.web.entities.Professional;
import com.equoterapia.web.repositories.ProfessionalRepository;
import com.equoterapia.web.services.ProfessionalService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("auth")
public class AuthResource {
    @Autowired
    private DaoAuthenticationProvider authenticationProvider;
    @Autowired
    private ProfessionalRepository professionalRepository;
    @Autowired
    private TokenService tokenService;
    @Autowired
    private ProfessionalService professionalService;


    @PostMapping(value = "/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody @Valid AuthenticationDTO user){
        var usernamePassword = new UsernamePasswordAuthenticationToken(user.username(),user.password());
        var auth = this.authenticationProvider.authenticate(usernamePassword);

        Professional professional = professionalRepository.findProfessionalByUsername(user.username());

        var token = tokenService.generateToken((Professional)auth.getPrincipal());

        return ResponseEntity.ok(new LoginResponseDTO(token, ((Professional) auth.getPrincipal()).getUsername(), professional.getName(), professional.getIsAdmin()));
    }
    @PostMapping(value = "/register")
    public ResponseEntity<Professional> register(@RequestBody @Valid RegisterDTO user, @RequestParam(required = false) String adminPass){
        if (this.professionalRepository.findByUsername(user.username()) != null){
            return ResponseEntity.badRequest().build();
        }

        String encryptedPassword = new BCryptPasswordEncoder().encode(user.password());
        Professional newProfessional = new Professional(user.name(), user.username(),user.birthDate(), encryptedPassword, user.cpf(), user.email(), user.phone(), user.address(), user.gender(), user.role(), user.regNumber());

        if (adminPass == null){
            professionalService.insert(newProfessional);
        }else {
            professionalService.insert(newProfessional, adminPass);
        }



        return ResponseEntity.ok().build();
    }

}

