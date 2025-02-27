package com.equoterapia.web.resources;

import com.equoterapia.web.entities.Appointment;
import com.equoterapia.web.services.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/appointment")
public class AppointmentResource {
    @Autowired
    private AppointmentService appointmentService;

    @GetMapping
    public ResponseEntity<List<Appointment>> findAll(){
        List<Appointment> appointmentList = appointmentService.findAll();
        return ResponseEntity.ok().body(appointmentList);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<Appointment> findOne(@PathVariable Long id){
        Appointment appointment = appointmentService.findById(id);

        return ResponseEntity.ok().body(appointment);
    }

    @PostMapping
    public ResponseEntity<Appointment> insert(@RequestBody Appointment appointment){
        appointment = appointmentService.insert(appointment);

        URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(appointment.getId())
                .toUri();
        return ResponseEntity.created(uri).body(appointment);
    }

    @DeleteMapping(value = {"/{id}"})
    public ResponseEntity<Void> delete(@PathVariable Long id){
        appointmentService.delete(id);

        return ResponseEntity.noContent().build();
    }


}
