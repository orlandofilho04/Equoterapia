package com.equoterapia.web.exceptions;

// Exceção personalizada lançada quando o nome de usuário não é encontrado durante a autenticação
public class ApiUsernameNotFoundException extends RuntimeException {
    public ApiUsernameNotFoundException(String message) {
        super(message);
    }
    public ApiUsernameNotFoundException(String message, Throwable throwable) {
        super(message, throwable);
    }
    public ApiUsernameNotFoundException(){};
}
