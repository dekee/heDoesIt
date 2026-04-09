package com.hedoesit.bakery.dto

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Positive

data class ProductRequest(
    @field:NotBlank val name: String,
    val description: String? = null,
    @field:Positive val priceCents: Long,
    val categoryId: Long? = null,
    val featured: Boolean = false,
    val active: Boolean = true,
    val displayOrder: Int = 0
)
