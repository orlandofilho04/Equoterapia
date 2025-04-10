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

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/appointment")
public class AppointmentResource {
    @Autowired
    private AppointmentService appointmentService;

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
