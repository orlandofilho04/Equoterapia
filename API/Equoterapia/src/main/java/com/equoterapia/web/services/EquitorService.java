package com.equoterapia.web.services;

import com.equoterapia.web.entities.Equitor;
import com.equoterapia.web.exceptions.NotFoundException;
import com.equoterapia.web.repositories.EquitorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EquitorService {
    @Autowired
        private EquitorRepository equitorRepository;

        public List<Equitor> findAll() {
            return equitorRepository.findAll();
        }

         public Equitor findById(Long id) {
             if (!equitorRepository.existsById(id)){
                 throw new NotFoundException("Equitor não encontrado");
             }

             return equitorRepository.findById(id).orElseThrow();
         }

         public Equitor insert(Equitor equitor) {
            return equitorRepository.save(equitor);
         }

         public Equitor update(Equitor equitor) {
            return equitorRepository.save(equitor);
         }
         public void delete(Long id) {equitorRepository.deleteById(id);}
}
