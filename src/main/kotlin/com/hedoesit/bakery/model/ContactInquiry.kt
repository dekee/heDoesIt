package com.hedoesit.bakery.model

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "contact_inquiries")
class ContactInquiry(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(nullable = false)
    var name: String = "",

    @Column(nullable = false)
    var email: String = "",

    var phone: String? = null,

    @Column(nullable = false)
    var inquiryType: String = "GENERAL",

    @Column(nullable = false, columnDefinition = "TEXT")
    var message: String = "",

    @Column(nullable = false)
    var read: Boolean = false,

    @Column(nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now()
)
