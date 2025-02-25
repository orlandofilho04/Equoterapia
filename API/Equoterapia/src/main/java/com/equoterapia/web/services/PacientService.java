package com.equoterapia.web.services;

import com.equoterapia.web.entities.Anamnesis;
import com.equoterapia.web.entities.Pacient;
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
    
    public Pacient findById(Long id){
        if (!pacientRepository.existsById(id)){
            log.error("Pacient NotFoundException");
            throw new NotFoundException("Paciente não encontrado");
        }

        return pacientRepository.findById(id).orElseThrow();
    }

    public void setPacientAnamnesis(Anamnesis anamnesis, Long pacient_id){

        pacientRepository.findById(pacient_id).orElseThrow();

        Pacient pacient = new Pacient();
        pacient.setAnamnesis(anamnesis);
        pacient.setId(pacient_id);

        pacientRepository.save(pacient);
    }

    public Pacient insert(Pacient pacient){

        return pacientRepository.save(pacient);
    }
}
