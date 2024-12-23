package com.equoterapia.web.services;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;

import com.equoterapia.web.entities.Pacient;
import com.equoterapia.web.repositories.PacientRepository;

public class LegallyResponsibleService {
    @Autowired
    private PacientRepository pacientRepository;

    public List<Pacient> findAll(){
        return pacientRepository.findAll();
    }
    public Pacient findById(Long id){
        Optional<Pacient> optionalPacient = pacientRepository.findById(id);
        return optionalPacient.orElseThrow(() -> new RuntimeException());
    }
    public void delete(Long id){
        pacientRepository.deleteById(id);
    }
     public Pacient insert(Pacient pai){
      return pacientRepository.save(pai);
     }
    }

