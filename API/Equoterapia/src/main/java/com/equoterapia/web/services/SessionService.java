package com.equoterapia.web.services;

import com.equoterapia.web.entities.*;
import com.equoterapia.web.exceptions.NotFoundException;
import com.equoterapia.web.exceptions.UnavailableDateException;
import com.equoterapia.web.repositories.SessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
    @Autowired
    private EquitorService equitorService;
    @Autowired
    private MediatorService mediatorService;


    public List<Session> findAll() {
        return sessionRepository.findAll();
    }
    
    public Session findById(Long id) {
        if (!sessionRepository.existsById(id)){
            throw new NotFoundException("Sessao não encontrada");
        }
        Optional<Session> optionalSession = sessionRepository.findById(id);
        return optionalSession.orElseThrow(RuntimeException::new);
    }
    
    public Session insert(Session session) {
        return sessionRepository.save(session);
    }

    public Session registerSession(Session session, Long pacient_id, Long horse_id, Long professional_id, Long equitor_id, Long mediator_id) {
        if (sessionRepository.existsSessionBySessionHour(session.getSessionHour())) throw new UnavailableDateException("Data indisponivel para agendamento !");


        Pacient pacient = pacientService.findById(pacient_id);
        Horse horse = horseService.findById(horse_id);
        Professional professional = professionalService.findById(professional_id);
        Equitor equitor = equitorService.findById(equitor_id);
        Mediator mediator = mediatorService.findById(mediator_id);

        session.getProfessionals().add(professional);
        session.setEquine(horse);
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

    public List<Session> findAllByEquitorId(Long equitor_id) {
        equitorService.findById(equitor_id);
        return sessionRepository.findAllByEquitorId(equitor_id);
    }
    public List<Session> findAllByMediatorId(Long mediator_id) {
        mediatorService.findById(mediator_id);
        return sessionRepository.findAllByMediatorId(mediator_id);
    }
}
