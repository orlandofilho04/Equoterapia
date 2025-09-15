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

// Handler global de exceções para a API. Captura exceções personalizadas e retorna respostas padronizadas.
@ControllerAdvice
public class ApiExceptionHandler extends ResponseEntityExceptionHandler {

    // Trata exceção de recurso não encontrado
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

    // Trata exceção de usuário não encontrado na autenticação
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

    // Trata exceção de verificação de token JWT inválido
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

    // Trata exceção de token JWT expirado
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

    // Trata exceção de data indisponível para agendamento
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

    // Trata exceção de acesso negado para administradores
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

    // Trata exceção de paciente que precisa estar ativo
    @ExceptionHandler(PacientMustBeActiveException.class)
    public ResponseEntity<Object> PacientMustBeActiveHandler(PacientMustBeActiveException pacientMustBeActiveException){
        HttpStatus statusCode =  HttpStatus.BAD_REQUEST;
        ExceptionPayload exceptionPayload = new ExceptionPayload(
                pacientMustBeActiveException.getMessage(),
                statusCode,
                ZonedDateTime.now(ZoneId.of("America/Sao_Paulo"))
        );
        return new ResponseEntity<>(exceptionPayload, statusCode);
    }

    // Trata exceção de papel (role) inválido
    @ExceptionHandler(InvalidRoleException.class)
    public ResponseEntity<Object> InvalidRoleExceptionHandler(InvalidRoleException invalidRoleException){
        HttpStatus statusCode =  HttpStatus.BAD_REQUEST;
        ExceptionPayload exceptionPayload = new ExceptionPayload(
                invalidRoleException.getMessage(),
                statusCode,
                ZonedDateTime.now(ZoneId.of("America/Sao_Paulo"))
        );
        return new ResponseEntity<>(exceptionPayload, statusCode);
    }
}
