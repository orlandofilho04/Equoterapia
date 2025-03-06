package com.equoterapia.web.resources;

import com.equoterapia.web.entities.Pacient;
import com.equoterapia.web.services.PacientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping(value = "/pacients")
public class PacientResource {

    @Autowired
    private PacientService pacientService;


    @GetMapping
    public ResponseEntity<List<Pacient>> findAll(){
        List<Pacient> pacients = pacientService.findAll();
        return ResponseEntity.ok().body(pacients);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<Pacient> findOne(@PathVariable(name = "id") Long id){
        return ResponseEntity.ok().body(pacientService.findById(id));
    }

    @PostMapping
    public ResponseEntity<Pacient> insert(@RequestBody Pacient pacient){
        pacient = pacientService.insert(pacient);
        URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}").buildAndExpand(pacient.getId()).
                toUri(); // configurando URI que será retornada ao criar user
        return ResponseEntity.created(uri).body(pacient);
    }
}
