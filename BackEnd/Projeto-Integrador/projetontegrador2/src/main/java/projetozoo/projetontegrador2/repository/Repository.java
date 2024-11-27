package projetozoo.projetontegrador2.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import projetozoo.projetontegrador2.model.Animal;

@org.springframework.stereotype.Repository
public interface Repository extends JpaRepository<Animal, Long> {
}
