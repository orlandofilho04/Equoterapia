package com.equoterapia.web.resources;

import java.net.URI;
import java.util.List;

import com.equoterapia.web.entities.LegallyResponsible;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.equoterapia.web.entities.Pacient;
import com.equoterapia.web.services.LegallyResponsibleService;

@RestController
@CrossOrigin("*")
@RequestMapping(value = "/ResponsavelLegal")
public class LegallyResponsibleResource{
    @Autowired
    private LegallyResponsibleService responsibleService;

    @GetMapping
    public ResponseEntity<List<LegallyResponsible>> findAll(){
        List<LegallyResponsible> legallyResponsibles = responsibleService.findAll();
        return ResponseEntity.ok().body(legallyResponsibles);
    }
      @PostMapping
    public ResponseEntity<LegallyResponsible> insert(@RequestBody LegallyResponsible legallyResponsible){
        legallyResponsible = responsibleService.insert(legallyResponsible);                    //
        URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}").buildAndExpand(legallyResponsible.getId()).
                toUri(); // configurando URI que será retornada ao criar user
        return ResponseEntity.created(uri).body(legallyResponsible);
    }

}