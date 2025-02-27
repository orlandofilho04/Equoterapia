package com.equoterapia.web.resources;

import com.equoterapia.web.entities.Anamnesis;
import com.equoterapia.web.entities.Pacient;
import com.equoterapia.web.services.AnamnesisService;
import com.equoterapia.web.services.PacientService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping(value = "/anamnesis")
@EnableTransactionManagement

public class AnamnesisResource {
    @Autowired
    private AnamnesisService anamnesisService;
    @Autowired
    private PacientService pacientService;

    @GetMapping
    @Operation(description = "Endpoint responsável por retornar todas as anamneses")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Busca por todos as anamneses realizada")
    })
    public ResponseEntity<List<Anamnesis>> findAll(){
        List<Anamnesis> anamnesisList = anamnesisService.findAll();
        return ResponseEntity.ok().body(anamnesisList);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<Anamnesis> findOne(@PathVariable(name = "id") Long id){
        Anamnesis anamnesis = anamnesisService.findById(id);
        return ResponseEntity.ok().body(anamnesis);
    }

    @PostMapping
    @Transactional
    public  ResponseEntity<Anamnesis> insertAnamnesis(@RequestBody Anamnesis anamnesis, @RequestParam Long pacient_id){

        //TODO talvez atribuir essa responsabilidade para outro método
        try {
            anamnesis = anamnesisService.insert(anamnesis);
            pacientService.setPacientAnamnesis(anamnesis, pacient_id);
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }

        URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}").buildAndExpand(anamnesis.getId())
                .toUri();
        return ResponseEntity.created(uri).body(anamnesis);

    }

}
