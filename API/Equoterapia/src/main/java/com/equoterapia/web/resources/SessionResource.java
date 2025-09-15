package com.equoterapia.web.resources;

import com.equoterapia.web.entities.Session;
import com.equoterapia.web.services.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

// Controlador REST para operações relacionadas a sessões de atendimento
@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping(value = "/sessions")
public class SessionResource {

    @Autowired
    private SessionService sessionService;

    // Busca todas as sessões, podendo filtrar por nome ou id do paciente
    @GetMapping
    public ResponseEntity<List<Session>> findAll(@RequestParam(required = false) String pacient_name, @RequestParam(required = false) Long pacient_id) {
        if (pacient_name != null && !pacient_name.isEmpty()){
            List<Session> sessions = sessionService.findAllByPacientName(pacient_name);
            return ResponseEntity.ok().body(sessions);
        }
        if (pacient_id != null && pacient_id > 0){
            List<Session> sessions = sessionService.findAllByPacientId(pacient_id);
            return ResponseEntity.ok().body(sessions);
        }
        List<Session> sessions = sessionService.findAll();
        return ResponseEntity.ok().body(sessions);
    }

    // Busca uma sessão pelo ID
    @GetMapping(value = "/{id}")
    public ResponseEntity<Session> findById(@PathVariable Long id) {
        Session session = sessionService.findById(id);
        return ResponseEntity.ok().body(session);
    }

    // Insere uma nova sessão
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

    // Insere uma nova sessão associando IDs de paciente, cavalo e profissionais
    @PostMapping(value = "/registerSession")
    public ResponseEntity<Session> registerSession(@RequestBody Session session,
                                                   @RequestParam Long pacient_id,
                                                   @RequestParam Long horse_id,
                                                   @RequestParam Long professional_id,
                                                   @RequestParam Long equitor_id,
                                                   @RequestParam Long mediator_id) {
        session = sessionService.registerSession(session, pacient_id, horse_id, professional_id, equitor_id, mediator_id);
        URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(session.getId())
                .toUri();
        return ResponseEntity.created(uri).body(session);
    }

    // Atualiza uma sessão existente pelo ID
    @PutMapping(value = "/{id}")
    public ResponseEntity<Session> update(@PathVariable Long id, @RequestBody Session session) {
        session.setId(id);
        session = sessionService.update(session);
        return ResponseEntity.ok().body(session);
    }

    // Remove uma sessão pelo ID
    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        sessionService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
