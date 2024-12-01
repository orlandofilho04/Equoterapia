package com.equoterapia.web.services;

import com.equoterapia.web.entities.Pacient;
import com.equoterapia.web.repositories.PacientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PacientService {
    @Autowired
    private PacientRepository pacientRepository;

    public List<Pacient> findAll(){
        return pacientRepository.findAll();
    }
    public Pacient findById(Long id){
        Optional<Pacient> optionalPacient = pacientRepository.findById(id);
        return optionalPacient.orElseThrow(() -> new RuntimeException());
    }
    public Pacient insert(Pacient pacient){
      return pacientRepository.save(pacient);
    }
}
