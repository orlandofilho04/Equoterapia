package com.equoterapia.web.services;

import com.equoterapia.web.entities.Anamnesis;
import com.equoterapia.web.entities.Appointment;
import com.equoterapia.web.entities.Pacient;
import com.equoterapia.web.entities.enums.PacientStatus;
import com.equoterapia.web.exceptions.NotFoundException;
import com.equoterapia.web.repositories.PacientRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class PacientService {

    @Autowired
    private PacientRepository pacientRepository;

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

    public Pacient insert(Pacient pacient){
        return pacientRepository.save(pacient);
    }
    public Pacient update(Pacient pacient){
        return pacientRepository.save(pacient);
    }
}
