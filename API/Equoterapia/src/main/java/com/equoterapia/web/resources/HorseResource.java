package com.equoterapia.web.resources;

import com.equoterapia.web.entities.Horse;
import com.equoterapia.web.services.HorseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping(value = "/horses")
public class HorseResource {

    @Autowired
    private HorseService horseService;

    // Endpoint q listar todos os cavalos
    @GetMapping
    public ResponseEntity<List<Horse>> findAll() {
        List<Horse> horses = horseService.findAll();
        return ResponseEntity.ok().body(horses);
    }

    // endpoint que inseri um cavalo
    @PostMapping
    public ResponseEntity<Horse> insert(@RequestBody Horse horse) {
        horse = horseService.insert(horse);
        URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(horse.getId())
                .toUri();
        return ResponseEntity.created(uri).body(horse);
    }

    // Endpoint que encontra um cavalo por id
    @GetMapping("/{id}")
    public ResponseEntity<Horse> findById(@PathVariable Long id) {
        Horse horse = horseService.findById(id);
        return ResponseEntity.ok().body(horse);
    }
}
