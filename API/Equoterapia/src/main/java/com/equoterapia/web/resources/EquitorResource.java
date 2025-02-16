package com.equoterapia.web.resources;

import com.equoterapia.web.entities.Equitor;
import com.equoterapia.web.services.EquitorService;
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

    @GetMapping
     public ResponseEntity<List<Equitor>> findAll(){
        List<Equitor> equitors = equitorService.findAll();
        return ResponseEntity.ok().body(equitors);
    }

    @PostMapping
    public ResponseEntity<Equitor> insert(@RequestBody Equitor equitor){
        equitor = equitorService.insert(equitor);
        URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}").buildAndExpand(equitor.getId()).
                 toUri();
        return ResponseEntity.created(uri).body(equitor);
    }
}
