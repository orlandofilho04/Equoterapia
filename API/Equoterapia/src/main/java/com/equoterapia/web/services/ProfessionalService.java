package com.equoterapia.web.services;

import com.equoterapia.web.entities.Pacient;
import com.equoterapia.web.entities.Professional;
import com.equoterapia.web.entities.Appointment;
import com.equoterapia.web.exceptions.NotFoundException;
import com.equoterapia.web.repositories.ProfessionalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProfessionalService {
    
    @Autowired
    private ProfessionalRepository professionalRepository;

    public List<Professional> findAll() {
        return professionalRepository.findAll();
    }

    public Professional findById(Long id) {
        if (!professionalRepository.existsById(id)) {
            throw new NotFoundException("Profissional não encontrado");
        }
        return professionalRepository.findById(id).orElseThrow();
    }

    public Professional insert(Professional professional) {
        return professionalRepository.save(professional);
    }

    public Professional update(Professional professional) {
        if (!professionalRepository.existsById(professional.getId())) {
            throw new NotFoundException("Profissional não encontrado");
        }
        return professionalRepository.save(professional);
    }

    public void delete(Long id) {
        if (!professionalRepository.existsById(id)) {
            throw new NotFoundException("Profissional não encontrado");
        }
        professionalRepository.deleteById(id);
    }

    public List<Pacient> listarMeusPacientesCadastrados(Long id) {
        Professional professional = findById(id);
        return professional.getPacients();
    }

    public List<Professional> listarTerapeutasAtivos() {
        return professionalRepository.findAll();
    }

    public List<Appointment> listarMinhasConsultas(Long id) {
        Professional professional = findById(id);
        return professional.getAppointments();
    }

    public Appointment marcarConsulta(Long professionalId, Appointment appointment) {
        Professional professional = findById(professionalId);
        appointment.setProfessional(professional);
        professional.getAppointments().add(appointment);
        professionalRepository.save(professional);
        return appointment;
    }

    public void desmarcarConsulta(Long professionalId, Long appointmentId) {
        Professional professional = findById(professionalId);
        professional.setAppointments(
            professional.getAppointments().stream()
                .filter(a -> !a.getId().equals(appointmentId))
                .collect(Collectors.toList())
        );
        professionalRepository.save(professional);
    }
}
