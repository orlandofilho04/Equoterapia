package com.equoterapia.web.services;
import java.util.List;
import java.util.Optional;

import com.equoterapia.web.entities.LegallyResponsible;
import com.equoterapia.web.repositories.LegallyResponsibleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LegallyResponsibleService {

    @Autowired
    private LegallyResponsibleRepository legallyResponsibleRepository;

    public List<LegallyResponsible> findAll(){
        return legallyResponsibleRepository.findAll();
    }

    public LegallyResponsible findById(Long id){
        Optional<LegallyResponsible> optionalLegallyResponsible = legallyResponsibleRepository.findById(id);
        return optionalLegallyResponsible.orElseThrow(() -> new RuntimeException());
    }

    public void delete(Long id){
        legallyResponsibleRepository.deleteById(id);
    }

     public LegallyResponsible insert(LegallyResponsible parent){
      return legallyResponsibleRepository.save(parent);
     }

    }

