package com.equoterapia.web.resources;

import java.net.URI;
import java.util.List;

import com.equoterapia.web.entities.LegallyResponsible;
import com.equoterapia.web.exceptions.NotFoundException;
import com.equoterapia.web.services.PacientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.equoterapia.web.entities.Pacient;
import com.equoterapia.web.services.LegallyResponsibleService;

@RestController
@CrossOrigin("*")
@RequestMapping(value = "/legallyResponsible")
public class LegallyResponsibleResource{
    @Autowired
    private LegallyResponsibleService responsibleService;
    @Autowired
    private PacientService pacientService;
    @Autowired
    private LegallyResponsibleService legallyResponsibleService;

    @GetMapping
    public ResponseEntity<List<LegallyResponsible>> findAll(){
        List<LegallyResponsible> legallyResponsibles = responsibleService.findAll();
        return ResponseEntity.ok().body(legallyResponsibles);
    }
    @PostMapping
    public ResponseEntity<LegallyResponsible> insert(@RequestBody LegallyResponsible legallyResponsible, @RequestParam List<Long> pacient_ids){
        try {
            List<Pacient> associatedPacient = pacientService.findAllById(pacient_ids);

            if (associatedPacient.size() != pacient_ids.size()){throw new NotFoundException("Um dos pacientes informado não existe");}

            legallyResponsible.setPacients(associatedPacient);

            legallyResponsible = legallyResponsibleService.insert(legallyResponsible);
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }

        URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}").buildAndExpand(legallyResponsible.getId())
                .toUri();
        return ResponseEntity.created(uri).body(legallyResponsible);
    }

}