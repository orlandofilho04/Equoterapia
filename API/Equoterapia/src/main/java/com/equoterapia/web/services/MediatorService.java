package com.equoterapia.web.services;


import com.equoterapia.web.entities.Mediator;
import com.equoterapia.web.exceptions.NotFoundException;
import com.equoterapia.web.repositories.MediatorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;
@Service
public class MediatorService {

    @Autowired
    private MediatorRepository mediatorRepository;

    public List<Mediator> findAll() {
        return mediatorRepository.findAll();
    }
    public Mediator findById(Long id) {
        if (!mediatorRepository.existsById(id)){
            throw new NotFoundException("Mediador não encontrado");
        }
        return mediatorRepository.findById(id).orElseThrow();
    }
    public Mediator insert(Mediator mediator) {
        return mediatorRepository.save(mediator);
    }

    public Mediator update(Mediator mediator) {
        if (!mediatorRepository.existsById(mediator.getId())){
            throw new NotFoundException("Mediador não encontrado");
        }
        return mediatorRepository.save(mediator);
    }

    public void delete(Long id) {mediatorRepository.deleteById(id);}
}
