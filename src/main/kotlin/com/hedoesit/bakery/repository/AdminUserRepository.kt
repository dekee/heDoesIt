package com.hedoesit.bakery.repository

import com.hedoesit.bakery.model.AdminUser
import org.springframework.data.jpa.repository.JpaRepository

interface AdminUserRepository : JpaRepository<AdminUser, Long> {
    fun findByEmail(email: String): AdminUser?
    fun existsByEmail(email: String): Boolean
}
