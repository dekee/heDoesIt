package com.hedoesit.bakery.repository

import com.hedoesit.bakery.model.Product
import org.springframework.data.jpa.repository.JpaRepository

interface ProductRepository : JpaRepository<Product, Long> {
    fun findByActiveTrueOrderByDisplayOrderAsc(): List<Product>
    fun findByActiveTrueAndFeaturedTrueOrderByDisplayOrderAsc(): List<Product>
    fun findByActiveTrueAndCategoryIdOrderByDisplayOrderAsc(categoryId: Long): List<Product>
}
