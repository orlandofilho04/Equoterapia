package com.equoterapia.web.entities;

import jakarta.persistence.*; 
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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

    @Column(nullable = false)
    private Integer age;

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
}
