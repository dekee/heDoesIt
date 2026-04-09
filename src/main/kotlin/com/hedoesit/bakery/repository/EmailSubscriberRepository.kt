package com.hedoesit.bakery.repository

import com.hedoesit.bakery.model.EmailSubscriber
import org.springframework.data.jpa.repository.JpaRepository

interface EmailSubscriberRepository : JpaRepository<EmailSubscriber, Long> {
    fun existsByEmail(email: String): Boolean
    fun findAllByOrderByCreatedAtDesc(): List<EmailSubscriber>
}
