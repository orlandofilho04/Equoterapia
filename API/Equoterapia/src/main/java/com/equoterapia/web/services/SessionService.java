package com.equoterapia.web.services;

import com.equoterapia.web.entities.Session;
import com.equoterapia.web.exceptions.NotFoundException;
import com.equoterapia.web.repositories.SessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SessionService {
    
    @Autowired
    private SessionRepository sessionRepository;
    
    public List<Session> findAll() {
        return sessionRepository.findAll();
    }
    
    public Session findById(Long id) {
        if (!sessionRepository.existsById(id)){
            throw new NotFoundException("Sessao não encontrada");
        }
        Optional<Session> optionalSession = sessionRepository.findById(id);
        return optionalSession.orElseThrow(() -> new RuntimeException("Runtime Error"));
    }
    
    public Session insert(Session session) {
        return sessionRepository.save(session);
    }

    // para verificar se a sessão existe antes de atualizar
    public Session update(Session session) {
        if (!sessionRepository.existsById(session.getId())){
            throw new NotFoundException("Sessao não encontrada");
        }

        return sessionRepository.save(session);
    }

    //verifica se a sessão existe antes de deletar
    public void delete(Long id) {
        if (!sessionRepository.existsById(id)){
            throw new NotFoundException("Sessao não encontrada");
        }
        sessionRepository.deleteById(id);
    }
}
