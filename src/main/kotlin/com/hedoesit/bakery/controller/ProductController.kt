package com.hedoesit.bakery.controller

import com.hedoesit.bakery.dto.ProductRequest
import com.hedoesit.bakery.dto.ProductResponse
import com.hedoesit.bakery.service.ProductService
import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

@RestController
class ProductController(
    private val productService: ProductService,
    private val objectMapper: ObjectMapper
) {
    @GetMapping("/api/products")
    fun getProducts(
        @RequestParam(required = false) category: Long?,
        @RequestParam(required = false) featured: Boolean?
    ): List<ProductResponse> {
        return productService.getActiveProducts(category, featured)
    }

    @GetMapping("/api/products/{id}")
    fun getProduct(@PathVariable id: Long): ProductResponse {
        return productService.getProductById(id)
    }

    @GetMapping("/api/admin/products")
    fun getAllProducts(): List<ProductResponse> {
        return productService.getAllProducts()
    }

    @PostMapping("/api/admin/products", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun createProduct(
        @RequestPart("product") productJson: String,
        @RequestPart("image", required = false) image: MultipartFile?
    ): ProductResponse {
        val request = objectMapper.readValue(productJson, ProductRequest::class.java)
        return productService.createProduct(request, image)
    }

    @PutMapping("/api/admin/products/{id}", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun updateProduct(
        @PathVariable id: Long,
        @RequestPart("product") productJson: String,
        @RequestPart("image", required = false) image: MultipartFile?
    ): ProductResponse {
        val request = objectMapper.readValue(productJson, ProductRequest::class.java)
        return productService.updateProduct(id, request, image)
    }

    @DeleteMapping("/api/admin/products/{id}")
    fun deleteProduct(@PathVariable id: Long): ResponseEntity<Void> {
        productService.deleteProduct(id)
        return ResponseEntity.noContent().build()
    }
}
