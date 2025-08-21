package com.equoterapia.web.services;
import java.util.List;

import com.equoterapia.web.entities.LegallyResponsible;
import com.equoterapia.web.exceptions.NotFoundException;
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

        if(!legallyResponsibleRepository.existsById(id)){
            throw new NotFoundException("Responsável legal não encontrado");
        }

        return legallyResponsibleRepository.findById(id).orElseThrow();
    }

    public LegallyResponsible findByCpf(String cpf){
        return legallyResponsibleRepository.findLegallyResponsibleByCpf(cpf).orElseThrow(NotFoundException::new);
    }

    public void delete(Long id){
        if (!legallyResponsibleRepository.existsById(id)){
            throw new NotFoundException("Responsável legal não encontrado");
        }
        legallyResponsibleRepository.deleteById(id);
    }

     public LegallyResponsible insert(LegallyResponsible parent){
      return legallyResponsibleRepository.save(parent);
     }

    }

