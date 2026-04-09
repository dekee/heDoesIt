package com.hedoesit.bakery.dto

import java.time.LocalDateTime

data class ProductResponse(
    val id: Long,
    val name: String,
    val description: String?,
    val priceCents: Long,
    val imageUrl: String?,
    val categoryId: Long?,
    val categoryName: String?,
    val featured: Boolean,
    val active: Boolean,
    val displayOrder: Int,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)
