package com.equoterapia.web.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Time;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tb_appoitments")

public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Time time;

    @ManyToOne
    @JoinColumn(name = "professional_id")
    private Professional professional;

    @ManyToOne
    @JoinColumn(name = "pacient_id")
    private Pacient pacient;

    @ManyToOne
    @JoinColumn(name = "anamnesis_id")
    private Anamnesis anamnesis;

}

