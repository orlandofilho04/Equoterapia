package com.equoterapia.web.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tb_anamnesis")
public class Anamnesis {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String reasonEvaluation;

    @Column
    private String currentIllnessHistory;

    @Column
    private String pastMedicalHistory;

    @Column
    private String familiarHistory;

    @Column
    private String observation;

    @OneToMany(mappedBy = "anamnesis")
    @JsonIgnore
    private List<Appointment> appointments = new ArrayList<>();

}
