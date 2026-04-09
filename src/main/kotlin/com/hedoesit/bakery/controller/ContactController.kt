package com.hedoesit.bakery.controller

import com.hedoesit.bakery.dto.ContactInquiryRequest
import com.hedoesit.bakery.dto.ContactInquiryResponse
import com.hedoesit.bakery.dto.SubscribeRequest
import com.hedoesit.bakery.model.EmailSubscriber
import com.hedoesit.bakery.repository.EmailSubscriberRepository
import com.hedoesit.bakery.service.ContactService
import com.hedoesit.bakery.service.EmailNotificationService
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
class ContactController(
    private val contactService: ContactService,
    private val emailSubscriberRepository: EmailSubscriberRepository,
    private val emailNotificationService: EmailNotificationService
) {
    @PostMapping("/api/contact")
    fun submitInquiry(@Valid @RequestBody request: ContactInquiryRequest): ContactInquiryResponse {
        return contactService.submitInquiry(request)
    }

    @PostMapping("/api/subscribe")
    fun subscribe(@Valid @RequestBody request: SubscribeRequest): ResponseEntity<Map<String, String>> {
        if (emailSubscriberRepository.existsByEmail(request.email)) {
            return ResponseEntity.ok(mapOf("message" to "You're already subscribed!"))
        }
        emailSubscriberRepository.save(EmailSubscriber(email = request.email))
        emailNotificationService.sendSubscriptionConfirmation(request.email)
        return ResponseEntity.ok(mapOf("message" to "Thanks for subscribing!"))
    }

    @GetMapping("/api/admin/inquiries")
    fun getInquiries(): List<ContactInquiryResponse> {
        return contactService.getAllInquiries()
    }

    @PutMapping("/api/admin/inquiries/{id}/read")
    fun markAsRead(@PathVariable id: Long): ContactInquiryResponse {
        return contactService.markAsRead(id)
    }

    @DeleteMapping("/api/admin/inquiries/{id}")
    fun deleteInquiry(@PathVariable id: Long): ResponseEntity<Void> {
        contactService.deleteInquiry(id)
        return ResponseEntity.noContent().build()
    }

    @GetMapping("/api/admin/subscribers")
    fun getSubscribers(): List<Map<String, Any>> {
        return emailSubscriberRepository.findAllByOrderByCreatedAtDesc().map {
            mapOf("id" to it.id, "email" to it.email, "createdAt" to it.createdAt)
        }
    }
}
