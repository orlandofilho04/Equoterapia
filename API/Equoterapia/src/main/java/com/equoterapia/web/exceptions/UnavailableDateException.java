package com.equoterapia.web.exceptions;

public class UnavailableDateException extends RuntimeException {
    public UnavailableDateException(String message) {
        super(message);
    }
    public UnavailableDateException(String message, Throwable throwable) {
        super(message, throwable);
    }
    public UnavailableDateException(){};
}
