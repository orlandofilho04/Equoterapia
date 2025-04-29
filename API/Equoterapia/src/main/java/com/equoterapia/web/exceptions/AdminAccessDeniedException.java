package com.equoterapia.web.exceptions;

public class AdminAccessDeniedException extends RuntimeException {
    public AdminAccessDeniedException(String message) {
        super(message);
    }
    public AdminAccessDeniedException(String message, Throwable throwable){super(message, throwable);}
    public AdminAccessDeniedException(){}
}
