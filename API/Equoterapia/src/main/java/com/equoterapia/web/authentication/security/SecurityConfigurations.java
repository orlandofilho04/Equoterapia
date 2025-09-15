package com.equoterapia.web.authentication.security;

import com.equoterapia.web.authentication.UserDetailsServiceImpl;
import com.equoterapia.web.repositories.ProfessionalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

// Classe de configuração de segurança da aplicação
@Configuration
@EnableWebSecurity
public class SecurityConfigurations {
    // Injeta o repositório de profissionais para autenticação
    @Autowired
    private ProfessionalRepository professionalRepository;

    // Injeta o filtro de segurança JWT
    @Autowired
    private SecurityFilter securityFilter;

    // Configura a cadeia de filtros de segurança do Spring Security
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception{
        return httpSecurity
                // Habilita CORS e desabilita CSRF (pois a API é stateless)
                .cors(Customizer.withDefaults()).csrf(AbstractHttpConfigurer::disable)
                // Define a política de sessão como stateless (sem sessão)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // Define as permissões de acesso para cada rota
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // Libera OPTIONS para CORS
                        .requestMatchers(HttpMethod.POST, "/auth/login").permitAll() // Libera login
                        .requestMatchers("/swagger-ui/**").permitAll() // Libera Swagger
                        .requestMatchers("/v3/api-docs*/**").permitAll() // Libera docs
                        .requestMatchers(HttpMethod.POST, "/auth/register").permitAll() // Libera registro
                        .requestMatchers(HttpMethod.POST, "/professional").denyAll() // Bloqueia criação direta de profissional
                        .anyRequest().authenticated() // Exige autenticação para o restante
                )
                // Adiciona o filtro JWT antes do filtro padrão de autenticação
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    // Configura o provedor de autenticação usando o UserDetailsService e o encoder de senha
    @Bean
    public DaoAuthenticationProvider authenticationProvider(){
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        UserDetailsServiceImpl userDetailsService = new UserDetailsServiceImpl(professionalRepository);

        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    // Define o encoder de senha como BCrypt
    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }
}
