package com.hedoesit.bakery.model

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "products")
class Product(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(nullable = false)
    var name: String = "",

    var description: String? = null,

    @Column(nullable = false)
    var priceCents: Long = 0,

    var imageFileName: String? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    var category: Category? = null,

    @Column(nullable = false)
    var featured: Boolean = false,

    @Column(nullable = false)
    var active: Boolean = true,

    @Column(nullable = false)
    var displayOrder: Int = 0,

    @Column(nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(nullable = false)
    var updatedAt: LocalDateTime = LocalDateTime.now()
)
