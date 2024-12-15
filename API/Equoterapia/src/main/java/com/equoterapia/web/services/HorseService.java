package com.equoterapia.web.services;

import com.equoterapia.web.entities.Horse;
import com.equoterapia.web.repositories.HorseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HorseService {

    @Autowired
    private HorseRepository horseRepository;

    public List<Horse> findAll() {
        return horseRepository.findAll();
    }

    public Horse findById(Long id) {
        Optional<Horse> optionalHorse = horseRepository.findById(id);
        return optionalHorse.orElseThrow(() -> new RuntimeException("Cavalo não encontrado"));
    }

    public Horse insert(Horse horse) {
        return horseRepository.save(horse);
    }
}
