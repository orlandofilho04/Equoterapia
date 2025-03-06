package com.equoterapia.web.services;

import com.equoterapia.web.entities.Anamnesis;
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

    @Autowired
    private AnamnesisService anamnesisService;
    @Autowired
    private PacientService pacientService;
    @Autowired
    private AppointmentService appointmentService;

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

    public Appointment marcarConsulta(Long professional_id, Long pacient_id, Appointment appointment) {
        try {
            Professional professional = findById(professional_id);
            Pacient pacient = pacientService.findById(pacient_id);

            appointment.setProfessional(professional);
            appointment.setAnamnesis(pacient.getAnamnesis());
            appointment.setPacient(pacient);

            pacient.getAnamnesis().getAppointments().add(appointment);
            pacient.getAppointments().add(appointment);
            professional.getPacients().add(pacient);
            professional.getAppointments().add(appointment);

            pacientService.update(pacient);
            anamnesisService.update(pacient.getAnamnesis());
            professionalRepository.save(professional);


            return appointmentService.insert(appointment);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

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
