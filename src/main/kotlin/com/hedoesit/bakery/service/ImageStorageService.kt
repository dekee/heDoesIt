package com.hedoesit.bakery.service

import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths
import java.util.UUID

@Service
class ImageStorageService(
    @Value("\${app.upload-dir:./uploads}") private val uploadDir: String
) {
    private val allowedTypes = setOf("image/jpeg", "image/png", "image/webp")
    private val maxFileSize = 5L * 1024 * 1024 // 5MB

    fun store(file: MultipartFile): String {
        require(file.contentType in allowedTypes) { "Only JPEG, PNG, and WebP images are allowed" }
        require(file.size <= maxFileSize) { "Image must be smaller than 5MB" }

        val productsDir = Paths.get(uploadDir, "products")
        Files.createDirectories(productsDir)

        val ext = file.originalFilename?.substringAfterLast('.', "jpg") ?: "jpg"
        val sanitized = file.originalFilename
            ?.substringBeforeLast('.')
            ?.replace(Regex("[^a-zA-Z0-9._-]"), "_")
            ?.take(50) ?: "image"
        val filename = "${UUID.randomUUID()}_$sanitized.$ext"

        val targetPath = productsDir.resolve(filename)
        file.transferTo(targetPath.toFile())

        return filename
    }

    fun delete(filename: String) {
        val path = Paths.get(uploadDir, "products", filename)
        Files.deleteIfExists(path)
    }
}
