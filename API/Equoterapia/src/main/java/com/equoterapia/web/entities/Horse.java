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
@Table(name = "horses") // nome da tabela
public class Horse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    private Long id; // identificador

    @Column(name = "name", nullable = false, length = 100)
    private String name; // nnome do cavalo

    @Column(name = "height")
    private Double height; // altura do cavalo

    @Column(name = "gait", length = 50)
    private String gait; // Tipo de marcha do cavalo

    @Column(name = "equipment", length = 200)
    private String equipment; // equipamentos "sela e estribo""

}
