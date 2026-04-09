package com.hedoesit.bakery.controller

import com.hedoesit.bakery.dto.CategoryRequest
import com.hedoesit.bakery.dto.CategoryResponse
import com.hedoesit.bakery.service.CategoryService
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
class CategoryController(
    private val categoryService: CategoryService
) {
    @GetMapping("/api/categories")
    fun getCategories(): List<CategoryResponse> {
        return categoryService.getAllCategories()
    }

    @PostMapping("/api/admin/categories")
    fun createCategory(@Valid @RequestBody request: CategoryRequest): CategoryResponse {
        return categoryService.createCategory(request)
    }

    @PutMapping("/api/admin/categories/{id}")
    fun updateCategory(@PathVariable id: Long, @Valid @RequestBody request: CategoryRequest): CategoryResponse {
        return categoryService.updateCategory(id, request)
    }

    @DeleteMapping("/api/admin/categories/{id}")
    fun deleteCategory(@PathVariable id: Long): ResponseEntity<Void> {
        categoryService.deleteCategory(id)
        return ResponseEntity.noContent().build()
    }
}
