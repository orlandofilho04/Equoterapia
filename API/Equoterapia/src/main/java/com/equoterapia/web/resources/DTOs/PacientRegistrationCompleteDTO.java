package com.equoterapia.web.resources.DTOs;

import com.equoterapia.web.entities.Anamnesis;
import com.equoterapia.web.entities.LegallyResponsible;
import com.equoterapia.web.entities.Pacient;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class PacientRegistrationCompleteDTO {
    private Pacient pacient;
    private List<LegallyResponsible> LegallyResponsibles;
    private Anamnesis anamnesis;

}
