package com.equoterapia.web.authentication.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.equoterapia.web.entities.Professional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

// Serviço responsável por gerar e validar tokens JWT
@Service
public class TokenService {
    // Segredo usado para assinar o token, configurado no application.properties
    @Value("${api.security.token.secret}")
    private String secret;

    // Gera um token JWT para o usuário autenticado
    public String generateToken(Professional professional){
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.create()
                    .withIssuer("auth-api") // Identifica quem gerou o token
                    .withSubject(professional.getUsername()) // Define o usuário como "subject"
                    .withExpiresAt(genExpirationDate()) // Define a expiração
                    .sign(algorithm); // Assina o token  
        } catch (JWTCreationException e) {
            throw new JWTCreationException("Erro ao tentar gerar o token", e);
        }
    }

    // Valida o token recebido e retorna o username se válido
    public String validateToken(String token){
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.require(algorithm)
                    .withIssuer("auth-api") 
                    .build()
                    .verify(token)
                    .getSubject();
        }catch (JWTVerificationException e){
            throw new JWTVerificationException("Token Invalido", e);
        }
    }

    // Gera a data de expiração do token (2 horas a partir de agora)
    private Instant genExpirationDate(){
        return LocalDateTime.now()
                .plusHours(2)
                .toInstant(ZoneOffset.of("-3"));
    }
}
