package com.hedoesit.bakery.service

import com.hedoesit.bakery.dto.ProductRequest
import com.hedoesit.bakery.dto.ProductResponse
import com.hedoesit.bakery.model.Product
import com.hedoesit.bakery.repository.CategoryRepository
import com.hedoesit.bakery.repository.ProductRepository
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import java.time.LocalDateTime

@Service
class ProductService(
    private val productRepository: ProductRepository,
    private val categoryRepository: CategoryRepository,
    private val imageStorageService: ImageStorageService
) {
    fun getActiveProducts(categoryId: Long?, featured: Boolean?): List<ProductResponse> {
        val products = when {
            featured == true -> productRepository.findByActiveTrueAndFeaturedTrueOrderByDisplayOrderAsc()
            categoryId != null -> productRepository.findByActiveTrueAndCategoryIdOrderByDisplayOrderAsc(categoryId)
            else -> productRepository.findByActiveTrueOrderByDisplayOrderAsc()
        }
        return products.map { toResponse(it) }
    }

    fun getProductById(id: Long): ProductResponse {
        val product = productRepository.findById(id)
            .orElseThrow { IllegalArgumentException("Product not found") }
        return toResponse(product)
    }

    fun getAllProducts(): List<ProductResponse> {
        return productRepository.findAll().sortedBy { it.displayOrder }.map { toResponse(it) }
    }

    fun createProduct(request: ProductRequest, image: MultipartFile?): ProductResponse {
        val category = request.categoryId?.let {
            categoryRepository.findById(it).orElseThrow { IllegalArgumentException("Category not found") }
        }
        val imageFileName = image?.let { imageStorageService.store(it) }

        val product = Product(
            name = request.name,
            description = request.description,
            priceCents = request.priceCents,
            imageFileName = imageFileName,
            category = category,
            featured = request.featured,
            active = request.active,
            displayOrder = request.displayOrder
        )
        return toResponse(productRepository.save(product))
    }

    fun updateProduct(id: Long, request: ProductRequest, image: MultipartFile?): ProductResponse {
        val product = productRepository.findById(id)
            .orElseThrow { IllegalArgumentException("Product not found") }

        val category = request.categoryId?.let {
            categoryRepository.findById(it).orElseThrow { IllegalArgumentException("Category not found") }
        }

        if (image != null) {
            product.imageFileName?.let { imageStorageService.delete(it) }
            product.imageFileName = imageStorageService.store(image)
        }

        product.name = request.name
        product.description = request.description
        product.priceCents = request.priceCents
        product.category = category
        product.featured = request.featured
        product.active = request.active
        product.displayOrder = request.displayOrder
        product.updatedAt = LocalDateTime.now()

        return toResponse(productRepository.save(product))
    }

    fun deleteProduct(id: Long) {
        val product = productRepository.findById(id)
            .orElseThrow { IllegalArgumentException("Product not found") }
        product.active = false
        product.updatedAt = LocalDateTime.now()
        productRepository.save(product)
    }

    private fun toResponse(product: Product) = ProductResponse(
        id = product.id,
        name = product.name,
        description = product.description,
        priceCents = product.priceCents,
        imageUrl = product.imageFileName?.let { "/api/images/$it" },
        categoryId = product.category?.id,
        categoryName = product.category?.name,
        featured = product.featured,
        active = product.active,
        displayOrder = product.displayOrder,
        createdAt = product.createdAt,
        updatedAt = product.updatedAt
    )
}
