package com.hedoesit.bakery.model

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "categories")
class Category(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(length = 100, unique = true, nullable = false)
    var name: String = "",

    var description: String? = null,

    @Column(nullable = false)
    var displayOrder: Int = 0,

    @Column(nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now()
)
