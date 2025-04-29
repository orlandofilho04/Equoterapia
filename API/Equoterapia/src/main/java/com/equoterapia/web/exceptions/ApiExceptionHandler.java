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
        HttpStatus statusCode = HttpStatus.NOT_FOUND;
        ExceptionPayload exceptionPayload = new ExceptionPayload(
                e.getMessage(),
                statusCode,
                ZonedDateTime.now(ZoneId.of("America/Sao_Paulo"))

        );
        return new ResponseEntity<>(exceptionPayload, statusCode);
    }
    @ExceptionHandler(ApiUsernameNotFoundException.class)
    public ResponseEntity<Object> usernameNotFoundExceptionHandler(ApiUsernameNotFoundException usernameNotFoundException){
        HttpStatus statusCode = HttpStatus.FORBIDDEN;
        ExceptionPayload exceptionPayload = new ExceptionPayload(
                usernameNotFoundException.getMessage(),
                statusCode,
                ZonedDateTime.now(ZoneId.of("America/Sao_Paulo"))
        );
        return new ResponseEntity<>(exceptionPayload, statusCode);
    }
    @ExceptionHandler(JWTVerificationException.class)
    public ResponseEntity<Object> jwtVerificationHandler(JWTVerificationException jwtVerificationException){
        HttpStatus statusCode =  HttpStatus.UNAUTHORIZED;
        ExceptionPayload exceptionPayload = new ExceptionPayload(
                jwtVerificationException.getMessage(),
                statusCode,
                ZonedDateTime.now(ZoneId.of("America/Sao_Paulo"))
        );
        return new ResponseEntity<>(exceptionPayload, statusCode);
    }
    @ExceptionHandler(TokenExpiredException.class)
    public ResponseEntity<Object> jwtExpirationHandler(TokenExpiredException expiredException){
        HttpStatus statusCode =  HttpStatus.FORBIDDEN;
        ExceptionPayload exceptionPayload = new ExceptionPayload(
                expiredException.getMessage(),
                statusCode,
                ZonedDateTime.now(ZoneId.of("America/Sao_Paulo"))
        );
        return new ResponseEntity<>(exceptionPayload, statusCode);
    }
    @ExceptionHandler(UnavailableDateException.class)
    public ResponseEntity<Object> unavailableDateHandler(UnavailableDateException unavailableDateException){
        HttpStatus statusCode =  HttpStatus.BAD_REQUEST;
        ExceptionPayload exceptionPayload = new ExceptionPayload(
                unavailableDateException.getMessage(),
                statusCode,
                ZonedDateTime.now(ZoneId.of("America/Sao_Paulo"))
        );
        return new ResponseEntity<>(exceptionPayload, statusCode);
    }
    @ExceptionHandler(AdminAccessDeniedException.class)
    public ResponseEntity<Object> adminAccessDeniedHandler(AdminAccessDeniedException adminAccessDeniedException){
        HttpStatus statusCode =  HttpStatus.FORBIDDEN;
        ExceptionPayload exceptionPayload = new ExceptionPayload(
                adminAccessDeniedException.getMessage(),
                statusCode,
                ZonedDateTime.now(ZoneId.of("America/Sao_Paulo"))
        );
        return new ResponseEntity<>(exceptionPayload, statusCode);
    }
}
