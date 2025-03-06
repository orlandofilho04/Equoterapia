package com.equoterapia.web.entities;

import com.equoterapia.web.entities.enums.Roles;
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
@Table(name = "tb_professionals")
public class  Professional {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private Roles roles;

    @ManyToMany
    @JoinTable(name = "tb_professionals_has_pacients",
            joinColumns = @JoinColumn(name = "professional_id"),
            inverseJoinColumns = @JoinColumn(name = "pacient_id"))
    private List<Pacient> pacients = new ArrayList<>();

    @OneToMany(mappedBy = "professional")
    @JsonIgnore
    private List<Appointment> appointments = new ArrayList<>();
}
