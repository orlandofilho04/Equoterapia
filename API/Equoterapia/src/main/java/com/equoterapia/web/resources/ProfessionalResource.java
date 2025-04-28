package com.equoterapia.web.resources;

import com.equoterapia.web.entities.Appointment;
import com.equoterapia.web.entities.Professional;
import com.equoterapia.web.services.ProfessionalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping(value = "/professional")
public class ProfessionalResource {

    @Autowired
    private ProfessionalService professionalService;

    @GetMapping
    public ResponseEntity<List<Professional>> findAll() {
        List<Professional> professionals = professionalService.findAll();
        return ResponseEntity.ok().body(professionals);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<Professional> findById(@PathVariable Long id) {
        Professional professional = professionalService.findById(id);
        return ResponseEntity.ok().body(professional);
    }

    @GetMapping(value = "/")
    public ResponseEntity<Professional> findProfessionalByUsername(@RequestParam String username) {
        Professional professional = professionalService.findProfessionalByUsername(username);
        return ResponseEntity.ok().body(professional);
    }

    @PostMapping
    public ResponseEntity<Professional> insert(@RequestBody Professional professional) {
        professional = professionalService.insert(professional);
        URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(professional.getId())
                .toUri();
        return ResponseEntity.created(uri).body(professional);
    }

    @PostMapping(value = "/scheduleAppointment")
    public ResponseEntity<Appointment> scheduleAppointment(@RequestParam Long professional_id,
                                                            @RequestParam Long pacient_id,
                                                            @RequestBody Appointment appointment){

        Appointment newAppointment = professionalService.marcarConsulta(professional_id, pacient_id, appointment);

        URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(newAppointment.getId())
                .toUri();
        return ResponseEntity.created(uri).body(newAppointment);
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<Professional> update(@PathVariable Long id, @RequestBody Professional professional) {
        professional.setId(id);
        professional = professionalService.update(professional);
        return ResponseEntity.ok().body(professional);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        professionalService.delete(id);
        return ResponseEntity.noContent().build();
    }
}