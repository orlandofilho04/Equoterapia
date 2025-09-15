package com.equoterapia.web.exceptions;

// Exceção personalizada lançada quando um recurso não é encontrado no sistema
public class NotFoundException extends RuntimeException {
    public NotFoundException(String message) {
        super(message);
    }
    public NotFoundException(String message, Throwable throwable) {
        super(message, throwable);
    }

    public NotFoundException() {}
}
