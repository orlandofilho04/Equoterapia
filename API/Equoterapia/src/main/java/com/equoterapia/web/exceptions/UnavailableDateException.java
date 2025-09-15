package com.equoterapia.web.exceptions;

// Exceção personalizada lançada quando uma data não está disponível para agendamento
public class UnavailableDateException extends RuntimeException {
    public UnavailableDateException(String message) {
        super(message);
    }
    public UnavailableDateException(String message, Throwable throwable) {
        super(message, throwable);
    }
    public UnavailableDateException(){};
}
