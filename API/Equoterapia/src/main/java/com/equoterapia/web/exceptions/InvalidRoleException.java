package com.equoterapia.web.exceptions;

// Exceção personalizada lançada quando um papel (role) inválido é informado
public class InvalidRoleException extends RuntimeException {
    public InvalidRoleException(String message) {
        super(message);
    }
    public InvalidRoleException(String message, Throwable throwable) {
        super(message, throwable);
    }
    public InvalidRoleException(){}
}
