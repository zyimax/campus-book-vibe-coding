package com.campusbook.controller;

import com.campusbook.dto.Result;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/upload")
public class FileController {

    @Value("${upload.path:uploads}")
    private String uploadPath;

    @PostMapping("/image")
    public Result<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return Result.error("文件不能为空");
            }

            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return Result.error("只能上传图片文件");
            }

            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String newFilename = UUID.randomUUID().toString() + extension;

            Path uploadDir = Paths.get(uploadPath);
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }

            Path filePath = uploadDir.resolve(newFilename);
            Files.copy(file.getInputStream(), filePath);

            String fileUrl = "/uploads/" + newFilename;
            Map<String, String> data = new HashMap<>();
            data.put("url", fileUrl);
            data.put("filename", newFilename);

            return Result.success(data);
        } catch (IOException e) {
            return Result.error("文件上传失败: " + e.getMessage());
        }
    }

    @DeleteMapping("/image/{filename}")
    public Result<String> deleteImage(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(uploadPath, filename);
            if (Files.exists(filePath)) {
                Files.delete(filePath);
                return Result.success("删除成功");
            } else {
                return Result.error("文件不存在");
            }
        } catch (IOException e) {
            return Result.error("删除失败: " + e.getMessage());
        }
    }
}
