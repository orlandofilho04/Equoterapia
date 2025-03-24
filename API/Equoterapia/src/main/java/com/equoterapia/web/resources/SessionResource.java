package com.equoterapia.web.resources;

import com.equoterapia.web.entities.Session;
import com.equoterapia.web.services.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping(value = "/sessions")
public class SessionResource {

    @Autowired
    private SessionService sessionService;

    @GetMapping
    public ResponseEntity<List<Session>> findAll() {
        List<Session> sessions = sessionService.findAll();
        return ResponseEntity.ok().body(sessions);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<Session> findById(@PathVariable Long id) {
        Session session = sessionService.findById(id);
        return ResponseEntity.ok().body(session);
    }

    @PostMapping
    public ResponseEntity<Session> insert(@RequestBody Session session) {
        session = sessionService.insert(session);
        URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(session.getId())
                .toUri();
        return ResponseEntity.created(uri).body(session);
    }
    @PostMapping(value = "/registerSession")
    public ResponseEntity<Session> registerSession(@RequestBody Session session,
                                                   @RequestParam Long pacient_id,
                                                   @RequestParam Long horse_id,
                                                   @RequestParam Long professional_id,
                                                   @RequestParam Long equitor_id) {
        session = sessionService.registerSession(session, pacient_id, horse_id, professional_id, equitor_id);
        URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(session.getId())
                .toUri();
        return ResponseEntity.created(uri).body(session);
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<Session> update(@PathVariable Long id, @RequestBody Session session) {
        session.setId(id);
        session = sessionService.update(session);
        return ResponseEntity.ok().body(session);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        sessionService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
