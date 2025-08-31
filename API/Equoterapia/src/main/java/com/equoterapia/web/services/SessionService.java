package com.equoterapia.web.services;

import com.equoterapia.web.entities.*;
import com.equoterapia.web.entities.enums.Roles;
import com.equoterapia.web.exceptions.InvalidRoleException;
import com.equoterapia.web.exceptions.NotFoundException;
import com.equoterapia.web.exceptions.PacientMustBeActiveException;
import com.equoterapia.web.exceptions.UnavailableDateException;
import com.equoterapia.web.repositories.SessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;

@Service
public class SessionService {
    
    @Autowired
    private SessionRepository sessionRepository;
    @Autowired
    private PacientService pacientService;
    @Autowired
    private HorseService horseService;
    @Autowired
    private ProfessionalService professionalService;

    public List<Session> findAll() {
        return sessionRepository.findAll();
    }
    
    public Session findById(Long id) {
        if (!sessionRepository.existsById(id)){
            throw new NotFoundException("Sessão não encontrada");
        }
        Optional<Session> optionalSession = sessionRepository.findById(id);
        return optionalSession.orElseThrow(RuntimeException::new);
    }
    
    public Session insert(Session session) {
        return sessionRepository.save(session);
    }

    @Transactional(rollbackFor = {NotFoundException.class, UnavailableDateException.class, PacientMustBeActiveException.class})
    public Session registerSession(Session session, Long pacient_id, Long horse_id, Long professional_id, Long equitor_id, Long mediator_id) {
        LocalDateTime sessionHour = session.getSessionHour();

        if (sessionRepository.existsSessionBySessionHour(sessionHour)) {
            throw new UnavailableDateException("Data e Hora indisponíveis para agendamento!");
        }

        if (sessionHour.isBefore(LocalDateTime.now(ZoneId.of("America/Sao_Paulo")))){
            throw new UnavailableDateException("Impossivel agendar uma sessão no passado");
        }

        String dayOfWeek = sessionHour.getDayOfWeek().toString();

        if ("SATURDAY".equalsIgnoreCase(dayOfWeek) || "SUNDAY".equalsIgnoreCase(dayOfWeek)) {
            throw new UnavailableDateException("Não é possivel agendar sessões nos fins de semana !");
        }

        Pacient pacient = pacientService.findById(pacient_id);
        if (!pacient.isActive()) throw new PacientMustBeActiveException("O paciente utilizado se encontra " + pacient.getStatus());
        Horse horse = horseService.findById(horse_id);

        Professional professional = professionalService.findById(professional_id);
        if (professional.getRole() == Roles.EQUITADOR || professional.getRole() == Roles.MEDIADOR){
            throw new InvalidRoleException("Este profissional não pode marcar uma consulta: "+professional.getName());
        }
        Professional equitor = professionalService.findById(equitor_id);
        if (equitor.getRole() != Roles.EQUITADOR){
            throw new InvalidRoleException("Profissão invalida, confira as informações. " +
                    "Esperado -> " + Roles.EQUITADOR + " | Obteve -> " + equitor.getRole());
        }
        Professional mediator = professionalService.findById(mediator_id);
        if (mediator.getRole() != Roles.MEDIADOR){
            throw new InvalidRoleException("Profissão invalida, confira as informações. " +
                    "Esperado -> " + Roles.MEDIADOR + " | Obteve -> " + mediator.getRole());
        }

        session.getProfessionals().add(professional);
        session.setHorse(horse);
        session.setPacient(pacient);
        session.setEquitor(equitor);
        session.setMediator(mediator);

        return sessionRepository.save(session);
    }

    public Session update(Session session) {
        if (!sessionRepository.existsById(session.getId())){
            throw new NotFoundException("Sessao não encontrada");
        }

        return sessionRepository.save(session);
    }

    public void delete(Long id) {
        if (!sessionRepository.existsById(id)){
            throw new NotFoundException("Sessao não encontrada");
        }
        sessionRepository.deleteById(id);
    }

    public List<Session> findAllByPacientName(String pacientName){
        return sessionRepository.findAllByPacientNameLike(pacientName);
    }

    public List<Session> findAllByPacientId(Long pacient_id){
        pacientService.findById(pacient_id);
        return sessionRepository.findAllByPacientId(pacient_id);
    }

    public List<Session> findAllByEquitorId(Long equitor_id) {
        professionalService.findById(equitor_id);
        return sessionRepository.findAllByEquitorId(equitor_id);
    }
    public List<Session> findAllByMediatorId(Long mediator_id) {
        professionalService.findById(mediator_id);
        return sessionRepository.findAllByMediatorId(mediator_id);
    }
}
