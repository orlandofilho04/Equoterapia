package com.equoterapia.web.entities;

import java.util.ArrayList;
import java.util.List;

import com.equoterapia.web.entities.enums.Genders;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
@Table(name = "tb_Legally_responsibles") // Mapeia para a tabela "tb_Legally_responsibles"
public class LegallyResponsible {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    @Column(unique = true)
    private String cpf;

    private Genders gender;

    // Relação muitos-para-muitos com pacientes
    @ManyToMany
    @JoinTable(
            name = "tb_LegallyResponsibles_has_pacients",
            joinColumns = @JoinColumn(name = "legally_responsible_id"),
            inverseJoinColumns = @JoinColumn(name = "pacient_id")
    )
    @JsonIgnore
    private  List<Pacient> pacients = new ArrayList<>();
    
}
