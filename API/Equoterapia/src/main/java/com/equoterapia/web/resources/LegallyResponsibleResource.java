package com.equoterapia.web.resources;

import java.net.URI;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.equoterapia.web.entities.Pacient;
import com.equoterapia.web.services.LegallyResponsibleService;

@RestController
@CrossOrigin("*")
@RequestMapping(value = "/ResponsavelLegal")
public class LegallyResponsibleResource{
    @Autowired
    private LegallyResponsibleService responsibleService;

    // @GetMapping
    // public ResponseEntity<List<LegallyResponsible>> findAll(){
    //     List<LegallyResponsible> legallyResponsibles = responsibleService.findAll();
    //     return ResponseEntity.ok().body(legallyResponsibles);
    // }
      @PostMapping
    public ResponseEntity<Pacient> insert(@RequestBody Pacient pacient){
        pacient = responsibleService.insert(pacient);                    //
        URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}").buildAndExpand(pacient.getId()).
                toUri(); // configurando URI que será retornada ao criar user
        return ResponseEntity.created(uri).body(pacient);
    }

}