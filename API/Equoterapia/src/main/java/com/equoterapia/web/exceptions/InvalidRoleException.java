package com.equoterapia.web.exceptions;

public class InvalidRoleException extends RuntimeException {
    public InvalidRoleException(String message) {
        super(message);
    }
    public InvalidRoleException(String message, Throwable throwable) {
        super(message, throwable);
    }
    public InvalidRoleException(){}
}
