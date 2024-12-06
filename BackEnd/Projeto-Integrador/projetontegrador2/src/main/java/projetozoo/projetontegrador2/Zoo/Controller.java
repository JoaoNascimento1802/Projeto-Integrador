package projetozoo.projetontegrador2.Zoo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import projetozoo.projetontegrador2.model.Animal;
import projetozoo.projetontegrador2.repository.Repository;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/zoo")
public class Controller {

    @Autowired
    private Repository repository;

    @GetMapping
    public List<Animal> listar() {
        return repository.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Animal addAnimal(@RequestBody Animal animal) {
        return repository.save(animal);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Animal> buscarPorId(@PathVariable Long id) {
        Optional<Animal> animal = repository.findById(id);
        if (animal.isPresent()) {
            return ResponseEntity.ok(animal.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody Animal a) {
        return repository.findById(id)
                .map(animal -> {
                    animal.setNome(a.getNome());
                    animal.setEspecie(a.getEspecie());
                    Animal at = repository.save(animal);
                    return ResponseEntity.ok(at);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/species/{species}")
public ResponseEntity<List<Animal>> buscarPorEspecie(@PathVariable String species) {
    try {
        List<Animal> animais = repository.findByEspecie(species); // Chama o repositório
        if (animais.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        return ResponseEntity.ok(animais);
    } catch (Exception e) {
        e.printStackTrace(); // Registra o erro para análise
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}

}
