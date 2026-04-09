package com.hedoesit.bakery.service

import com.hedoesit.bakery.dto.CategoryRequest
import com.hedoesit.bakery.dto.CategoryResponse
import com.hedoesit.bakery.model.Category
import com.hedoesit.bakery.repository.CategoryRepository
import org.springframework.stereotype.Service

@Service
class CategoryService(
    private val categoryRepository: CategoryRepository
) {
    fun getAllCategories(): List<CategoryResponse> {
        return categoryRepository.findAllByOrderByDisplayOrderAsc().map { toResponse(it) }
    }

    fun createCategory(request: CategoryRequest): CategoryResponse {
        val category = Category(
            name = request.name,
            description = request.description,
            displayOrder = request.displayOrder
        )
        return toResponse(categoryRepository.save(category))
    }

    fun updateCategory(id: Long, request: CategoryRequest): CategoryResponse {
        val category = categoryRepository.findById(id)
            .orElseThrow { IllegalArgumentException("Category not found") }
        category.name = request.name
        category.description = request.description
        category.displayOrder = request.displayOrder
        return toResponse(categoryRepository.save(category))
    }

    fun deleteCategory(id: Long) {
        categoryRepository.deleteById(id)
    }

    private fun toResponse(category: Category) = CategoryResponse(
        id = category.id,
        name = category.name,
        description = category.description,
        displayOrder = category.displayOrder,
        createdAt = category.createdAt
    )
}
