package com.equoterapia.web.services;

import com.equoterapia.web.entities.Anamnesis;
import com.equoterapia.web.entities.Appointment;
import com.equoterapia.web.entities.LegallyResponsible;
import com.equoterapia.web.entities.Pacient;
import com.equoterapia.web.entities.enums.PacientStatus;
import com.equoterapia.web.exceptions.LegallyResponsibleMissingException;
import com.equoterapia.web.exceptions.NotFoundException;
import com.equoterapia.web.repositories.LegallyResponsibleRepository;
import com.equoterapia.web.repositories.PacientRepository;
import com.equoterapia.web.resources.DTOs.PacientRegistrationCompleteDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class PacientService {

    @Autowired
    private PacientRepository pacientRepository;
    @Autowired
    private LegallyResponsibleRepository legallyResponsibleRepository;

    public List<Pacient> findAll(){
        return pacientRepository.findAll();
    }

    public List<Pacient> findAllById(List<Long> ids){
        pacientRepository.findAllById(ids);

        return pacientRepository.findAllById(ids);
    }

    public List<Pacient> findAllPacientsByStatus(PacientStatus pacientStatus){

        return pacientRepository.findAllByStatus(pacientStatus);
    }

    
    public Pacient findById(Long id){
        if (!pacientRepository.existsById(id)){
            throw new NotFoundException("Paciente não encontrado");
        }

        return pacientRepository.findById(id).orElseThrow(NotFoundException::new);
    }

    public void setPacientAnamnesis(Anamnesis anamnesis, Long pacient_id){

        pacientRepository.findById(pacient_id).orElseThrow();

        Pacient pacient = pacientRepository.findById(pacient_id).orElseThrow();
        pacient.setAnamnesis(anamnesis);
        pacient.setId(pacient_id);

        pacientRepository.save(pacient);
    }

    public String changeStatus(Long pacient_id){
        Pacient pacient = pacientRepository.findById(pacient_id).orElseThrow(NotFoundException::new);
        StringBuilder message = new StringBuilder().append("O paciente ")
                .append(pacient.getName())
                .append("agora possui o status: ")
                .append(pacient.getStatus());

        if (!pacient.isActive()){
            pacient.setStatus(PacientStatus.ATIVO);
            pacientRepository.save(pacient);
            return message.toString();
        }
        pacient.setStatus(PacientStatus.ARQUIVADO);
        pacientRepository.save(pacient);
        return message.toString();
    }

    public Pacient insert(Pacient pacient){
        return pacientRepository.save(pacient);
    }
    public Pacient insertPacientWithResponsible(Pacient pacient, List<LegallyResponsible> legallyResponsibles, Anamnesis anamnesis){
        pacient.setAnamnesis(anamnesis);
        Pacient savedPacient = pacientRepository.save(pacient);

        if (legallyResponsibles == null){
            throw new LegallyResponsibleMissingException("O parâmetro Responsável Legal está faltante");
        }

        for (LegallyResponsible legallyResponsible : legallyResponsibles){
            Optional<LegallyResponsible> legallyResponsibleOpt = legallyResponsibleRepository.findLegallyResponsibleByCpf(legallyResponsible.getCpf());
            LegallyResponsible managedLegallyResponsible;

            managedLegallyResponsible = legallyResponsibleOpt.orElseGet(() -> legallyResponsibleRepository.save(legallyResponsible));

            managedLegallyResponsible.getPacients().add(savedPacient);
            legallyResponsibleRepository.save(managedLegallyResponsible);

        }
        return savedPacient;
    }
    public Pacient update(Pacient pacient){
        return pacientRepository.save(pacient);
    }
}
