package com.equoterapia.web.authentication;


import com.equoterapia.web.repositories.ProfessionalRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

public class UserDetailsServiceImpl implements UserDetailsService {
    private final ProfessionalRepository professionalRepository;

    public UserDetailsServiceImpl(ProfessionalRepository professionalRepository) {
        this.professionalRepository = professionalRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserDetails professional = professionalRepository.findByUsername(username);
        if(professional == null){
            throw new UsernameNotFoundException("Usuário não encontrado!");
        }
        return professionalRepository.findByUsername(username);
    }
}
