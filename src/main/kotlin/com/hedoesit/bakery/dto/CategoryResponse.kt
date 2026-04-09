package com.hedoesit.bakery.dto

import java.time.LocalDateTime

data class CategoryResponse(
    val id: Long,
    val name: String,
    val description: String?,
    val displayOrder: Int,
    val createdAt: LocalDateTime
)
