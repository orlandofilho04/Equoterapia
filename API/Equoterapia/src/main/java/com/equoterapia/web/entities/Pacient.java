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

    @Column
    private String name;

    @Column
    private LocalDate birthDate;

    @Column
    private String photo;

    @Column
    private Genders gender;

    @Column
    private PacientStatus status;

    @ManyToMany(mappedBy = "pacients")
    private List<LegallyResponsible> LegallyResponsibles  = new ArrayList<>();

    @OneToMany(mappedBy = "pacient", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Session> sessions = new ArrayList<>();

    @ManyToMany(mappedBy = "pacients")
    @JsonIgnore
    private List<Professional> professionals = new ArrayList<>();

    @OneToMany(mappedBy = "pacient")
    @JsonIgnore
    private List<Appointment> appointments = new ArrayList<>();

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "anamnesis_id", referencedColumnName = "id")
    private Anamnesis anamnesis;

    @JsonIgnore
    public boolean isActive(){
        return this.status.toString().equalsIgnoreCase("ativo");
    }


}