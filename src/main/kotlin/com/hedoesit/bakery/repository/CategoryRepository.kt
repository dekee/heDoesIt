package com.hedoesit.bakery.repository

import com.hedoesit.bakery.model.Category
import org.springframework.data.jpa.repository.JpaRepository

interface CategoryRepository : JpaRepository<Category, Long> {
    fun findAllByOrderByDisplayOrderAsc(): List<Category>
    fun existsByName(name: String): Boolean
}
