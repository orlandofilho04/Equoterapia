package com.equoterapia.web.services;

import com.equoterapia.web.entities.Anamnesis;
import com.equoterapia.web.repositories.AnamnesisRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AnamnesisService {
    @Autowired
    AnamnesisRepository anamnesisRepository;

    public List<Anamnesis> findAll(){
        return anamnesisRepository.findAll();
    }
    public Anamnesis findById(Long id){
        Optional<Anamnesis> optionalAnamnesis = anamnesisRepository.findById(id);
        return optionalAnamnesis.orElseThrow(RuntimeException::new);
    }

    public Anamnesis insert(Anamnesis anamnesis){ return anamnesisRepository.save(anamnesis);}
}
