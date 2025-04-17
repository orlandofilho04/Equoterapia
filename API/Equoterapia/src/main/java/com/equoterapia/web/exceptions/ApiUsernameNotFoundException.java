package com.equoterapia.web.exceptions;

public class ApiUsernameNotFoundException extends RuntimeException {
    public ApiUsernameNotFoundException(String message) {
        super(message);
    }
    public ApiUsernameNotFoundException(String message, Throwable throwable) {
        super(message, throwable);
    }
    public ApiUsernameNotFoundException(){};
}
