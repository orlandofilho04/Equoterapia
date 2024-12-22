package com.equoterapia.web.services;

import com.equoterapia.web.entities.Administrator;
import com.equoterapia.web.repositories.AdministratorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdministratorService {
    @Autowired
    private AdministratorRepository administratorRepository;

    public List<Administrator> findAll() {
        return administratorRepository.findAll();
    }

    public Administrator findById(Long id) {
        Optional<Administrator> optionalAdministrator = administratorRepository.findById(id);
        return optionalAdministrator.orElseThrow(() -> new RuntimeException("Administrator not found"));
    }

    public Administrator insert(Administrator administrator) {
        return administratorRepository.save(administrator);
    }

    public Administrator update(Administrator administrator) {
        return administratorRepository.save(administrator);
    }

    public void delete(Long id) {
        administratorRepository.deleteById(id);
    }

    public Administrator findByEmail(String email) {
        return administratorRepository.findByEmail(email);
    }
}