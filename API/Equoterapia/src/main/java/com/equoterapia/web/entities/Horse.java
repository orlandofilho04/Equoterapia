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

    @Column(name = "name",length = 100, nullable = false)
    private String name;

    @Column(name = "height", nullable = false)
    private Double height;

    @Column(name = "gait", length = 50, nullable = false)
    private String gait;

    @Column(name = "equipment", length = 200, nullable = false)
    private String equipment;
}
