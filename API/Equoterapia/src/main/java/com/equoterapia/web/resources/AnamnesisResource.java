package com.equoterapia.web.resources;

import com.equoterapia.web.entities.Anamnesis;
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
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping(value = "/anamnesis")
@EnableTransactionManagement

public class AnamnesisResource {
    @Autowired
    private AnamnesisService anamnesisService;
    @Autowired
    private PacientService pacientService;


    @Operation(description = "Endpoint responsável por retornar todas as anamneses")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Busca por anamneses concluída"),
            @ApiResponse(responseCode = "500", description = "Erro Interno do Servidor")
    })
    @GetMapping
    public ResponseEntity<List<Anamnesis>> findAll(){
        List<Anamnesis> anamnesisList = anamnesisService.findAll();
        return ResponseEntity.ok().body(anamnesisList);
    }

    @Operation(description = "Endpoint responsável por buscar uma anamnese por a partir de um ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Busca por anamnese concluída"),
            @ApiResponse(responseCode = "404", description = "Anamnese não encontrada"),
            @ApiResponse(responseCode = "500", description = "Erro Interno do Servidor")
    })
    @GetMapping(value = "/{id}")
    public ResponseEntity<Anamnesis> findOne(@PathVariable(name = "id") Long id){
        Anamnesis anamnesis = anamnesisService.findById(id);
        return ResponseEntity.ok().body(anamnesis);
    }

    @PostMapping
    @Operation(description = "Endpoint responsável por inserir uma anamnese e associar ao paciente")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Anamnese criada com sucesso"),
            @ApiResponse(responseCode = "404", description = "Paciente não encontrado"),
            @ApiResponse(responseCode = "500", description = "Erro Interno do Servidor")
    })
    public  ResponseEntity<Anamnesis> insertAnamnesis(@RequestBody Anamnesis anamnesis, @RequestParam(required = true) Long pacient_id){
        try {
            pacientService.findById(pacient_id);
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
