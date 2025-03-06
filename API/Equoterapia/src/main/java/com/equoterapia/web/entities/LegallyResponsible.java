package com.equoterapia.web.entities;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tb_Legally_responsibles")
public class LegallyResponsible {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String cpf;
    private char sexo;
    @ManyToMany
    @JoinTable(
            name = "tb_LegallyResponsibles_has_pacients",
            joinColumns = @JoinColumn(name = "legally_responsible_id"),
            inverseJoinColumns = @JoinColumn(name = "pacient_id")
    )
    @JsonIgnore
    private  List<Pacient> pacients = new ArrayList<>();

    public void addPacients(List<Pacient> pacients) {
        this.pacients.addAll(pacients);
    }
}
