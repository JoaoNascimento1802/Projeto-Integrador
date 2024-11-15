package projetozoo.projetontegrador2.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "zoologico")
public class Animal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String especie;

}
