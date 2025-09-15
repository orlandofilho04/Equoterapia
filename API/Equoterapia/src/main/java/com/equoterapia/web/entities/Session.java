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

// Lombok gera getters, setters e construtores automaticamente
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity // Indica que esta classe é uma entidade JPA
@Table(name = "tb_sessions") // Mapeia para a tabela "tb_sessions"
public class Session {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private LocalDateTime sessionHour; // Data e hora da sessão

    @Column
    private LocalTime duration; // Duração da sessão

    @Column
    private SessionStatus sessionStatus; // Status da sessão (enum)

    // Relação muitos-para-muitos com profissionais
    @ManyToMany
    @JoinTable(name = "tb_sessions_has_professionals",
            joinColumns = @JoinColumn(name = "session_id"),
            inverseJoinColumns = @JoinColumn(name = "professional_id"))
    private List<Professional> professionals = new ArrayList<>();

    // Relação muitos-para-um com paciente
    @ManyToOne
    @JoinColumn(name = "pacient_id")
    private Pacient pacient;

    // Relação muitos-para-um com cavalo
    @ManyToOne
    @JoinColumn(name = "horse_id")
    private Horse horse;

    // Relação muitos-para-um com profissional (equitor)
    @ManyToOne
    @JoinColumn(name = "equitor_id")
    private Professional equitor;

    // Relação muitos-para-um com profissional (mediador)
    @ManyToOne
    @JoinColumn(name = "mediator_id")
    private Professional mediator;
}
