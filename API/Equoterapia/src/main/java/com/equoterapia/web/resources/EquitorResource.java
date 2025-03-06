package com.equoterapia.web.resources;

import com.equoterapia.web.entities.Equitor;
import com.equoterapia.web.services.EquitorService;
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
@CrossOrigin("*")
@RequestMapping(value = "/equitors")
public class EquitorResource {

    @Autowired
    private EquitorService equitorService;

    @Operation(description = "Rota reponsavel por retornar todos os equitadores")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Equitadores encontrados com sucesso"),
            @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
    })
    @GetMapping
    public ResponseEntity<List<Equitor>> findAll() {
        List<Equitor> equitors = equitorService.findAll();
        return ResponseEntity.ok().body(equitors);
    }

    @Operation(description = "Rota responsavel por criar um novo equitador")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Equitador criado com sucesso"),
            @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
    })
    @PostMapping
    public ResponseEntity<Equitor> insert(@RequestBody Equitor equitor) {
        equitor = equitorService.insert(equitor);
        URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}").buildAndExpand(equitor.getId()).
                toUri();
        return ResponseEntity.created(uri).body(equitor);
    }

    @Operation(description = "Rota responsavel por atualizar os dados de um equitador existente")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Equitador atualizado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Equitador não encontrado"),
            @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
    })
    @PutMapping(value = "/{id}")
    public ResponseEntity<Equitor> update(@PathVariable Long id, @RequestBody Equitor equitor) {
        equitor.setId(id);
        equitor = equitorService.update(equitor);
        URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}").buildAndExpand(equitor.getId()).
                toUri();
        return ResponseEntity.created(uri).body(equitor);
    }

    @Operation(description = "Rota responsavel por deletar um equitador pelo ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Equitador deletado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Equitador não encontrado"),
            @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
    })
    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        equitorService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
