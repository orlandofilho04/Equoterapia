package com.equoterapia.web.entities;

import com.equoterapia.web.entities.enums.Genders;
import com.equoterapia.web.entities.enums.PacientStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.ZoneId;

import com.equoterapia.web.entities.enums.HorsesStatus;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity 
@Table(name = "tb_horses")
public class Horse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    private Long id;

    @Column(nullable = false, unique = true)
    private String registerCode;

    @Column(length = 100, nullable = false)
    private String name;

    @Column
    private String photo;

    @Column(nullable = false)
    private Integer age;

    @Column
    private Genders sex;

    @Column(nullable = false)
    private String breed;

    @Column(nullable = false)
    private Double height;

    @Column(nullable = false)
    private Double weight;

    @Column(length = 50, nullable = false)
    private String gait;

    @Column(length = 200, nullable = false)
    private String equipment;

    @Column(length = 250, nullable = false)
    private String specialsTraits;

    @Column(length = 50, nullable = false)
    private String coatColor;

    @Column
    private LocalDateTime createdAt = LocalDateTime.now(ZoneId.of("America/Sao_Paulo"));

    @Column
    private HorsesStatus status;

    @JsonIgnore
    public boolean isActive(){
        return this.status.toString().equalsIgnoreCase("ativo");
    }
}
