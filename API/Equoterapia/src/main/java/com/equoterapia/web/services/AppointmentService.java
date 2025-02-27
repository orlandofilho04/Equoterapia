package com.equoterapia.web.services;

import com.equoterapia.web.entities.Appointment;
import com.equoterapia.web.exceptions.NotFoundException;
import com.equoterapia.web.repositories.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppointmentService {
    @Autowired
    private AppointmentRepository appointmentRepository;

    public List<Appointment> findAll(){
        return appointmentRepository.findAll();
    }

    public Appointment findById(Long id){
        if (!appointmentRepository.existsById(id)){
            throw new NotFoundException("Consulta não encontrada");
        }

        return appointmentRepository.findById(id).orElseThrow(RuntimeException::new);
    }

    public Appointment insert(Appointment appointment){
        return appointmentRepository.save(appointment);
    }

    public void delete(Long id){
        if (!appointmentRepository.existsById(id)){
            throw new NotFoundException("Consulta não encontrada");
        }
        appointmentRepository.deleteById(id);
    }


}
