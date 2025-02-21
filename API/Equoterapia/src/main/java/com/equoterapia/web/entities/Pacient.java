package com.equoterapia.web.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tb_pacients")
public class Pacient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private LocalDate birthDate;

    @ManyToMany(mappedBy = "pacients")
    private List<LegallyResponsible> LegallyResponsibles  = new ArrayList<>();

    @OneToMany(mappedBy = "pacient", cascade = CascadeType.ALL)
    private List<Session> sessions = new ArrayList<>();

    @ManyToMany(mappedBy = "pacients")
    private List<Professional> professionals = new ArrayList<>();

    @OneToMany(mappedBy = "pacient")
    private List<Appointment> appointments = new ArrayList<>();

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "anamnesis_id", referencedColumnName = "id")
    private Anamnesis anamnesis;


}