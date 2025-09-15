package com.equoterapia.web.exceptions;

// Exceção personalizada lançada quando um token JWT não é encontrado na requisição
public class TokenNotFoundException extends RuntimeException {
    public TokenNotFoundException(String message) {
        super(message);
    }
}
