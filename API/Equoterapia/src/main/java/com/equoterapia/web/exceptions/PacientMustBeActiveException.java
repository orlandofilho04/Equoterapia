package com.equoterapia.web.exceptions;

public class PacientMustBeActiveException extends RuntimeException {
    public PacientMustBeActiveException(String message) {
        super(message);
    }
    public PacientMustBeActiveException(String message, Throwable throwable) {
        super(message, throwable);
    }
    public PacientMustBeActiveException(){};
}
