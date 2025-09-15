package com.equoterapia.web.authentication;


import com.equoterapia.web.exceptions.ApiUsernameNotFoundException;
import com.equoterapia.web.repositories.ProfessionalRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

// Implementação do serviço de autenticação do Spring Security
public class UserDetailsServiceImpl implements UserDetailsService {
    // Repositório para acessar os profissionais no banco de dados
    private final ProfessionalRepository professionalRepository;

    // Construtor que recebe o repositório de profissionais
    public UserDetailsServiceImpl(ProfessionalRepository professionalRepository) {
        this.professionalRepository = professionalRepository;
    }

    // Método chamado pelo Spring Security para buscar um usuário pelo nome de usuário
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Busca o profissional pelo nome de usuário
        UserDetails professional = professionalRepository.findByUsername(username);
        // Se não encontrar, lança exceção personalizada
        if(professional == null){
            throw new ApiUsernameNotFoundException("Usuário não encontrado!");
        }
        // Retorna o usuário encontrado
        return professionalRepository.findByUsername(username);
    }
}
