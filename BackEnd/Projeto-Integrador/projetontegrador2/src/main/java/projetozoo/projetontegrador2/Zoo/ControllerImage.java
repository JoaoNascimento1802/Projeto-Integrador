package projetozoo.projetontegrador2.Zoo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import projetozoo.projetontegrador2.config.CloudinaryConfig;
import projetozoo.projetontegrador2.model.Animal;
import projetozoo.projetontegrador2.repository.Repository;

import java.util.Map;

@RestController
@RequestMapping("/image")
public class ControllerImage {
    @Autowired
    private projetozoo.projetontegrador2.service.CloudnaryService imageService;

    @Autowired
    private Repository repository;

    @PostMapping("/upload/{id}")
    public ResponseEntity<Map<String, String>> uploadImage(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        try {
            Map<String, Object> uploadResult = imageService.uploadImage(file);
            String imageUrl = (String) uploadResult.get("url");

            Animal animal = repository.findById(id).orElseThrow(() -> new RuntimeException("Animal não encontrado com ID: " + id));
            animal.setImagURL(imageUrl);
            repository.save(animal);

            return ResponseEntity.ok(Map.of("url", imageUrl));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Falha no upload: " + e.getMessage()));
        }
    }
}