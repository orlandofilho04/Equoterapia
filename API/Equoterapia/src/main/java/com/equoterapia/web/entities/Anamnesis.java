package com.equoterapia.web.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

// Lombok gera getters, setters e construtores automaticamente
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tb_anamnesis") // Mapeia para a tabela "tb_anamnesis"
public class Anamnesis {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String reasonEvaluation; // Motivo da avaliação

    @Column
    private String currentIllnessHistory; // Histórico da doença atual

    @Column
    private String pastMedicalHistory; // Histórico médico passado

    @Column
    private String familiarHistory; // Histórico familiar

    @Column
    private String observation; // Observações gerais

    // Relação um-para-muitos com agendamentos
    @OneToMany(mappedBy = "anamnesis")
    @JsonIgnore
    private List<Appointment> appointments = new ArrayList<>();

}
