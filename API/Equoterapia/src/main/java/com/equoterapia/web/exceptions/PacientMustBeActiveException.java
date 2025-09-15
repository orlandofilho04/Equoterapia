package com.equoterapia.web.exceptions;

// Exceção personalizada lançada quando uma operação exige que o paciente esteja ativo
public class PacientMustBeActiveException extends RuntimeException {
    public PacientMustBeActiveException(String message) {
        super(message);
    }
    public PacientMustBeActiveException(String message, Throwable throwable) {
        super(message, throwable);
    }
    public PacientMustBeActiveException(){};
}
