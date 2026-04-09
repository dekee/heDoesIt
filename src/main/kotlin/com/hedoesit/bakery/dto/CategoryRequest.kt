package com.hedoesit.bakery.dto

import jakarta.validation.constraints.NotBlank

data class CategoryRequest(
    @field:NotBlank val name: String,
    val description: String? = null,
    val displayOrder: Int = 0
)
