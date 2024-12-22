package com.equoterapia.web.resources;

import com.equoterapia.web.entities.Administrator;
import com.equoterapia.web.services.AdministratorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping(value = "/administrators")
public class AdministratorResource {

    @Autowired
    private AdministratorService administratorService;

    @GetMapping
    public ResponseEntity<List<Administrator>> findAll() {
        List<Administrator> administrators = administratorService.findAll();
        return ResponseEntity.ok().body(administrators);
    }

    @PostMapping
    public ResponseEntity<Administrator> insert(@RequestBody Administrator administrator) {
        administrator = administratorService.insert(administrator);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(administrator.getId())
                .toUri();
        return ResponseEntity.created(uri).body(administrator);
    }
}