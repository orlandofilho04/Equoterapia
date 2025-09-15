package com.equoterapia.web.exceptions;

import lombok.Getter;
import org.springframework.http.HttpStatus;

import java.time.ZonedDateTime;

// Classe que representa o corpo da resposta de erro retornada pela API
@Getter
public class ExceptionPayload {
    private final String message; // Mensagem de erro
    private final HttpStatus httpStatus;// Status HTTP associado ao erro
    private final ZonedDateTime timeStamp; // Momento em que o erro ocorreu

    public ExceptionPayload(String message, HttpStatus httpStatus, ZonedDateTime timeStamp) {
        this.message = message;
        this.httpStatus = httpStatus;
        this.timeStamp = timeStamp;
    }

}
