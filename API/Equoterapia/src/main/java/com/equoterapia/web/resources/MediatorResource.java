package com.equoterapia.web.resources;


import com.equoterapia.web.entities.Mediator;
import com.equoterapia.web.entities.Session;
import com.equoterapia.web.services.MediatorService;
import com.equoterapia.web.services.SessionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping(value = "/mediators")
public class MediatorResource {
    @Autowired
    private MediatorService mediatorService;
    @Autowired
    private SessionService sessionService;

    @Operation(description = "Rota reponsavel por retornar todos os Mediadores")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Mediadores encontrados com sucesso"),
            @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
    })
    @GetMapping
    public ResponseEntity<List<Mediator>> findAll() {
        List<Mediator> mediator = mediatorService.findAll();
        return ResponseEntity.ok().body(mediator);
    }
    //@Operation(description = "Rota reponsavel por retornar a agendo do equitador")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Agenda retornada com sucesso"),
            @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
    })// tratar esses valores
    @GetMapping(value = "/schedules")
    public ResponseEntity<List<Session>> findAllSessionsByMediator(@RequestParam Long mediator_id) {
        List<Session> sessionsByMediator = sessionService.findAllByMediatorId(mediator_id);
        return ResponseEntity.ok().body(sessionsByMediator);
    }

    @Operation(description = "Rota responsavel por criar um novo equitador")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Equitador criado com sucesso"),
            @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
    })
    @PostMapping
    public ResponseEntity<Mediator> insert(@RequestBody Mediator mediator) {
        mediator = mediatorService.insert(mediator);
        URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}").buildAndExpand(mediator.getId()).
                toUri();
        return ResponseEntity.created(uri).body(mediator);
    }

    @Operation(description = "Rota responsavel por atualizar os dados de um mediador existente")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Mediador atualizado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Mediador não encontrado"),
            @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
    })
    @PutMapping(value = "/{id}")
    public ResponseEntity<Mediator> update(@PathVariable Long id, @RequestBody Mediator mediator) {
        mediator.setId(id);
        mediator = mediatorService.update(mediator);
        URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}").buildAndExpand(mediator.getId()).
                toUri();
        return ResponseEntity.created(uri).body(mediator);
    }

    @Operation(description = "Rota responsavel por deletar um mediador pelo ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Mediador deletado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Mediador não encontrado"),
            @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
    })
    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        mediatorService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
