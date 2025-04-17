package com.equoterapia.web.exceptions;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.exceptions.TokenExpiredException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.time.ZoneId;
import java.time.ZonedDateTime;

@ControllerAdvice
public class ApiExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<Object> notFoundExceptionHandler(NotFoundException e){
        HttpStatus notFound = HttpStatus.NOT_FOUND;
        ExceptionPayload exceptionPayload = new ExceptionPayload(
                e.getMessage(),
                notFound,
                ZonedDateTime.now(ZoneId.of("America/Sao_Paulo"))

        );
        return new ResponseEntity<>(exceptionPayload, notFound);
    }
    @ExceptionHandler(ApiUsernameNotFoundException.class)
    public ResponseEntity<Object> usernameNotFoundExceptionHandler(ApiUsernameNotFoundException usernameNotFoundException){
        HttpStatus forbidden = HttpStatus.FORBIDDEN;
        ExceptionPayload exceptionPayload = new ExceptionPayload(
                usernameNotFoundException.getMessage(),
                forbidden,
                ZonedDateTime.now(ZoneId.of("America/Sao_Paulo"))
        );
        return new ResponseEntity<>(exceptionPayload, forbidden);
    }
    @ExceptionHandler(JWTVerificationException.class)
    public ResponseEntity<Object> jwtVerificationHandler(JWTVerificationException jwtVerificationException){
        HttpStatus unauthorized =  HttpStatus.UNAUTHORIZED;
        ExceptionPayload exceptionPayload = new ExceptionPayload(
                jwtVerificationException.getMessage(),
                unauthorized,
                ZonedDateTime.now(ZoneId.of("America/Sao_Paulo"))
        );
        return new ResponseEntity<>(exceptionPayload, unauthorized);
    }
    @ExceptionHandler(TokenExpiredException.class)
    public ResponseEntity<Object> jwtExpirationHandler(TokenExpiredException expiredException){
        HttpStatus forbidden =  HttpStatus.FORBIDDEN;
        ExceptionPayload exceptionPayload = new ExceptionPayload(
                expiredException.getMessage(),
                forbidden,
                ZonedDateTime.now(ZoneId.of("America/Sao_Paulo"))
        );
        return new ResponseEntity<>(exceptionPayload, forbidden);
    }
}
