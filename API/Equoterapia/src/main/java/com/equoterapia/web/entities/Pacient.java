package com.equoterapia.web.entities;

import com.equoterapia.web.entities.enums.Genders;
import com.equoterapia.web.entities.enums.PacientStatus;
import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

// Lombok gera getters, setters e construtores automaticamente
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity // Indica que esta classe é uma entidade JPA
@Table(name = "tb_pacients") // Mapeia para a tabela "tb_pacients"
public class Pacient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String name;

    @Column
    private LocalDate birthDate;

    @Column
    private String photo;

    @Column
    private Genders gender;

    @Column
    private PacientStatus status; // Enum de status do paciente

    // Relação muitos-para-muitos com responsáveis legais
    @ManyToMany(mappedBy = "pacients")
    private List<LegallyResponsible> legallyResponsibles  = new ArrayList<>();

    // Relação um-para-muitos com sessões
    @OneToMany(mappedBy = "pacient", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Session> sessions = new ArrayList<>();

    // Relação muitos-para-muitos com profissionais
    @ManyToMany(mappedBy = "pacients")
    @JsonIgnore
    private List<Professional> professionals = new ArrayList<>();

    // Relação um-para-muitos com agendamentos
    @OneToMany(mappedBy = "pacient")
    @JsonIgnore
    private List<Appointment> appointments = new ArrayList<>();

    // Relação um-para-um com anamnese
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "anamnesis_id", referencedColumnName = "id")
    private Anamnesis anamnesis;

    // Método auxiliar para verificar se o paciente está ativo
    @JsonIgnore
    public boolean isActive(){
        return this.status.toString().equalsIgnoreCase("ativo");
    }


}