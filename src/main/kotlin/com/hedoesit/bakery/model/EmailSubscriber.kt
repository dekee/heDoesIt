package com.hedoesit.bakery.model

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "email_subscribers")
class EmailSubscriber(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(unique = true, nullable = false)
    var email: String = "",

    @Column(nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now()
)
