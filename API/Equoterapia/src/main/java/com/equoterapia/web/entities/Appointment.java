package com.equoterapia.web.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Time;

// Lombok gera getters, setters e construtores automaticamente
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tb_appoitments") // Mapeia para a tabela "tb_appoitments"

public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private Time time; // Horário do agendamento

    // Relação muitos-para-um com profissional
    @ManyToOne
    @JoinColumn(name = "professional_id")
    private Professional professional;

    // Relação muitos-para-um com paciente
    @ManyToOne
    @JoinColumn(name = "pacient_id")
    private Pacient pacient;

    // Relação muitos-para-um com anamnese
    @ManyToOne
    @JoinColumn(name = "anamnesis_id")
    @JsonIgnore
    private Anamnesis anamnesis;

}

