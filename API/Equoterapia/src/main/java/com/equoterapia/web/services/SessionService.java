package com.equoterapia.web.services;

import com.equoterapia.web.entities.Session;
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
        Optional<Session> optionalSession = sessionRepository.findById(id);
        return optionalSession.orElseThrow(() -> new RuntimeException("Sessão não encontrada"));
    }
    
    public Session insert(Session session) {
        return sessionRepository.save(session);
    }

 // para verificar se a sessão existe antes de atualizar
    public Session update(Session session) {
       
        findById(session.getId());
        return sessionRepository.save(session);
    }

//verifica se a sessão existe antes de deletar
    public void delete(Long id) {
        
        findById(id);
        sessionRepository.deleteById(id);
    }
}
