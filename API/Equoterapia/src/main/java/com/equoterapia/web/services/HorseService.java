package com.equoterapia.web.services;

import com.equoterapia.web.entities.Horse;
import com.equoterapia.web.exceptions.NotFoundException;
import com.equoterapia.web.repositories.HorseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HorseService {

    @Autowired
    private HorseRepository horseRepository;

    public List<Horse> findAll() {
        return horseRepository.findAll();
    }

    public Horse findById(Long id) {
        if (!horseRepository.existsById(id)){
            throw new NotFoundException("Cavalo não encontrado");
        }

        return horseRepository.findById(id).orElseThrow();
    }

    public Horse insert(Horse horse) {
        return horseRepository.save(horse);
    }
}
