package com.equoterapia.web;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// Anotação que indica que esta é a classe principal de uma aplicação Spring Boot
@SpringBootApplication
public class EquoterapiaApplication {

    // Método main: ponto de entrada da aplicação Spring Boot
    public static void main(String[] args) {
        // Inicializa o contexto Spring e sobe o servidor embutido
        SpringApplication.run(EquoterapiaApplication.class, args);
    }

}
