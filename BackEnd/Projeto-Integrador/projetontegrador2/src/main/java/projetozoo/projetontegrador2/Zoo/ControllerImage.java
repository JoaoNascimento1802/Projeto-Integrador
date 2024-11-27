package projetozoo.projetontegrador2.Zoo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import projetozoo.projetontegrador2.config.CloudinaryConfig;
import projetozoo.projetontegrador2.config.CloudnaryService;
import projetozoo.projetontegrador2.model.Animal;
import projetozoo.projetontegrador2.repository.Repository;

import java.util.Map;

@RestController
@RequestMapping("/zoo/image")
public class ControllerImage {


    @Autowired
    private CloudnaryService imageService;

    @Autowired
    private Repository repository;

    @PostMapping("/upload/{id}")
    public ResponseEntity<Map<String, String>> uploadImage(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        try {
            // Log para debugging
            System.out.println("Recebendo arquivo para upload...");

            if (file.isEmpty()) {
                throw new IllegalArgumentException("O arquivo enviado está vazio.");
            }

            Map<String, Object> uploadResult = imageService.uploadImage(file);
            System.out.println("Resultado do upload: " + uploadResult);

            String imageUrl = (String) uploadResult.get("url");

            Animal animal = repository.findById(id).orElseThrow(() ->
                    new RuntimeException("Animal não encontrado com ID: " + id)
            );
            animal.setImagURL(imageUrl);
            repository.save(animal);

            return ResponseEntity.ok(Map.of("url", imageUrl));
        } catch (Exception e) {
            System.err.println("Erro durante o upload: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Falha no upload: " + e.getMessage()));
        }
    }
}
