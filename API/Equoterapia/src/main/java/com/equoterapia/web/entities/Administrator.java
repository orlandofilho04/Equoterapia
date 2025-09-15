package com.equoterapia.web.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// Lombok gera getters, setters e construtores automaticamente
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity // Indica que esta classe é uma entidade JPA
@Table(name = "tb_administrators") // Mapeia para a tabela "tb_administrators"
public class Administrator {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Chave primária auto-incrementada
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, unique = true)
    private String cpf;
}