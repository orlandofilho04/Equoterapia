package com.equoterapia.web.resources;

import com.equoterapia.web.entities.Horse;
import com.equoterapia.web.services.HorseService;
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
@RequestMapping(value = "/horses")
public class HorseResource {

    @Autowired
    private HorseService horseService;

    @Operation(description = "Rota reponsavel por retornar todos os cavalos")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cavalos encontrados com sucesso")
    })
    @GetMapping
    public ResponseEntity<List<Horse>> findAll() {
        List<Horse> horses = horseService.findAll();
        return ResponseEntity.ok().body(horses);
    }

    @Operation(description = "Rota responsavel por retornar um cavalo pelo ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cavalo encontrado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Cavalo não encontrado")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Horse> findById(@PathVariable Long id) {
        Horse horse = horseService.findById(id);
        return ResponseEntity.ok().body(horse);
    }

    @Operation(description = "Rota responsavel por inserir um novo cavalo")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Cavalo criado com sucesso"),
            @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
    })
    @PostMapping
    public ResponseEntity<Horse> insert(@RequestBody Horse horse) {
        horse = horseService.insert(horse);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(horse.getId())
                .toUri();
        return ResponseEntity.created(uri).body(horse);
    }

    @Operation(description = "Rota responsavel por atualizar os dados de um cavalo")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cavalo atualizado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Cavalo não encontrado")
    })
    @PutMapping("/{id}")
    public ResponseEntity<Horse> update(@PathVariable Long id, @RequestBody Horse horse) {
        horse.setId(id);
        horse = horseService.update(horse);
        URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(horse.getId())
                .toUri();
        return ResponseEntity.created(uri).body(horse);
    }

    @Operation(description = "Rota responsavel por deletar um cavalo pelo ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Cavalo deletado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Cavalo não encontrado")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        horseService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
