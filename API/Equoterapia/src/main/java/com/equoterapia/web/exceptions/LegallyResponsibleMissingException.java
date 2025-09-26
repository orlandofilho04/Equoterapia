package com.equoterapia.web.exceptions;

import com.equoterapia.web.entities.Pacient;

public class LegallyResponsibleMissingException extends RuntimeException {
    public LegallyResponsibleMissingException(String message) {
        super(message);
    }
    public LegallyResponsibleMissingException(String message, Throwable throwable) {super(message,throwable);}
    public LegallyResponsibleMissingException() {}
}
