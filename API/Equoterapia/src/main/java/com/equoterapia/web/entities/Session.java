package com.equoterapia.web.entities;

import com.equoterapia.web.entities.enums.SessionStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tb_sessions")
public class Session {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDateTime sessionHour;
    private LocalTime duration;
    private SessionStatus sessionStatus;

    @ManyToMany
    @JoinTable(name = "tb_sessions_has_professionals",
            joinColumns = @JoinColumn(name = "session_id"),
            inverseJoinColumns = @JoinColumn(name = "professional_id"))
    private List<Professional> professionals = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "pacient_id")
    private Pacient pacient = new Pacient();

    @ManyToOne
    @JoinColumn(name = "horse_id")
    private Horse equine = new Horse();

    @ManyToOne
    @JoinColumn(name = "equitor_id")
    private Equitor equitor = new Equitor();
    @ManyToOne
    @JoinColumn(name = "mediator_id")
    private Mediator mediator = new Mediator();
}
