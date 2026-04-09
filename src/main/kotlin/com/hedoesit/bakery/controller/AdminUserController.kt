package com.hedoesit.bakery.controller

import com.hedoesit.bakery.model.AdminUser
import com.hedoesit.bakery.repository.AdminUserRepository
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/admin/users")
class AdminUserController(
    private val adminUserRepository: AdminUserRepository
) {
    @GetMapping
    fun getAdminUsers(): List<Map<String, Any>> {
        return adminUserRepository.findAll().map {
            mapOf("id" to it.id, "email" to it.email, "name" to it.name, "createdAt" to it.createdAt)
        }
    }

    @PostMapping
    fun addAdminUser(@RequestBody body: Map<String, String>): Map<String, Any> {
        val email = body["email"] ?: throw IllegalArgumentException("Email required")
        val name = body["name"] ?: "Admin"
        if (adminUserRepository.existsByEmail(email)) {
            throw IllegalStateException("Admin user already exists")
        }
        val saved = adminUserRepository.save(AdminUser(email = email, name = name))
        return mapOf("id" to saved.id, "email" to saved.email, "name" to saved.name, "createdAt" to saved.createdAt)
    }

    @DeleteMapping("/{id}")
    fun removeAdminUser(@PathVariable id: Long): ResponseEntity<Void> {
        adminUserRepository.deleteById(id)
        return ResponseEntity.noContent().build()
    }
}
