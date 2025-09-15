package com.equoterapia.web.repositories;

import com.equoterapia.web.entities.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

// Repositório para operações com a entidade Appointment (agendamento)
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
}
