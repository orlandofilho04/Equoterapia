package com.equoterapia.web.exceptions;

// Exceção personalizada lançada quando um acesso administrativo é negado
public class AdminAccessDeniedException extends RuntimeException {
    public AdminAccessDeniedException(String message) {
        super(message);
    }
    public AdminAccessDeniedException(String message, Throwable throwable){super(message, throwable);}
    public AdminAccessDeniedException(){}
}
