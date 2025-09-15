package com.equoterapia.web.authentication.security;

import com.equoterapia.web.repositories.ProfessionalRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

// Filtro de segurança que intercepta todas as requisições para validar o token JWT
@Component
public class SecurityFilter extends OncePerRequestFilter {
    @Autowired
    private TokenService tokenService;

    @Autowired
    private ProfessionalRepository professionalRepository;

    // Método chamado a cada requisição para aplicar a lógica do filtro
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // Recupera o token do header Authorization
        var token = this.recoverToken(request);
        if (token != null){
            // Valida o token e obtém o username
            var username = tokenService.validateToken(token);
            // Busca o usuário no banco de dados
            UserDetails professional = professionalRepository.findByUsername(username);

            // Cria o objeto de autenticação e coloca no contexto de segurança do Spring
            var authentication = new UsernamePasswordAuthenticationToken(professional, null, professional.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        // Continua a cadeia de filtros
        filterChain.doFilter(request, response);
    }

    // Método auxiliar para extrair o token JWT do header Authorization
    private String recoverToken(HttpServletRequest request){
        var authHeader = request.getHeader("Authorization");
        if (authHeader == null) return null;
        return authHeader.replace("Bearer ", "");
    }
}
