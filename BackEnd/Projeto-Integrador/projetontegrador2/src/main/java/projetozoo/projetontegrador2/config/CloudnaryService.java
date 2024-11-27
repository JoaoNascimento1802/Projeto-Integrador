package projetozoo.projetontegrador2.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudnaryService {
    private final Cloudinary cloudinary;

    @Autowired
    public CloudnaryService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    public Map<String, Object> uploadImage(MultipartFile file) throws IOException {
        return cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
    }
}
