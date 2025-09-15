package com.equoterapia.web.resources;

import com.equoterapia.web.entities.Appointment;
import com.equoterapia.web.services.AppointmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

// Controlador REST para operações relacionadas a agendamentos (consultas)
@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/appointment")
public class AppointmentResource {
    @Autowired
    private AppointmentService appointmentService;

    // Retorna todas as consultas
    @GetMapping
    @Operation(description = "Endpoint responsável por retornar todas as consultas")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Busca por consultas concluída"),
            @ApiResponse(responseCode = "500", description = "Erro Interno do Servidor")
    })
    public ResponseEntity<List<Appointment>> findAll(){
        List<Appointment> appointmentList = appointmentService.findAll();
        return ResponseEntity.ok().body(appointmentList);
    }

    // Busca uma consulta por ID
    @GetMapping(value = "/{id}")
    @Operation(description = "Endpoint responsável por buscar uma consulta por ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Busca por consulta concluída"),
            @ApiResponse(responseCode = "404", description = "Consulta não encontrada"),
            @ApiResponse(responseCode = "500", description = "Erro Interno do Servidor")
    })
    public ResponseEntity<Appointment> findOne(@PathVariable Long id){
        Appointment appointment = appointmentService.findById(id);

        return ResponseEntity.ok().body(appointment);
    }

    // Insere uma nova consulta
    @PostMapping
    @Operation(description = "Endpoint responsável por inserir uma consulta")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Consulta criada com sucesso"),
            @ApiResponse(responseCode = "404", description = "Consulta não encontrada"),
            @ApiResponse(responseCode = "500", description = "Erro Interno do Servidor")
    })
    public ResponseEntity<Appointment> insert(@RequestBody Appointment appointment){
        appointment = appointmentService.insert(appointment);

        URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(appointment.getId())
                .toUri();
        return ResponseEntity.created(uri).body(appointment);
    }

    // Atualiza uma consulta existente
    @PutMapping
    @Operation(description = "Endpoint responsável por atualizar uma consulta")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Consulta atualizada com sucesso"),
            @ApiResponse(responseCode = "404", description = "Consulta não encontrada"),
            @ApiResponse(responseCode = "500", description = "Erro Interno do Servidor")
    })
    public ResponseEntity<Appointment> update(@RequestBody Appointment appointment){
        appointment = appointmentService.update(appointment);

        URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(appointment.getId())
                .toUri();
        return ResponseEntity.created(uri).body(appointment);
    }

    // Deleta uma consulta por ID
    @DeleteMapping(value = {"/{id}"})
    @Operation(description = "Endpoint responsável por deletar uma consulta por ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Consulta deletada com sucesso"),
            @ApiResponse(responseCode = "404", description = "Consulta não encontrada"),
            @ApiResponse(responseCode = "500", description = "Erro Interno do Servidor")
    })
    public ResponseEntity<Void> delete(@PathVariable Long id){
        appointmentService.delete(id);

        return ResponseEntity.noContent().build();
    }


}
