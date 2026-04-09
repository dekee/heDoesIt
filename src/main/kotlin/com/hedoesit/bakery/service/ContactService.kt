package com.hedoesit.bakery.service

import com.hedoesit.bakery.dto.ContactInquiryRequest
import com.hedoesit.bakery.dto.ContactInquiryResponse
import com.hedoesit.bakery.model.ContactInquiry
import com.hedoesit.bakery.repository.ContactInquiryRepository
import org.springframework.stereotype.Service

@Service
class ContactService(
    private val contactInquiryRepository: ContactInquiryRepository,
    private val emailNotificationService: EmailNotificationService
) {
    fun submitInquiry(request: ContactInquiryRequest): ContactInquiryResponse {
        val inquiry = ContactInquiry(
            name = request.name,
            email = request.email,
            phone = request.phone,
            inquiryType = request.inquiryType,
            message = request.message
        )
        val saved = contactInquiryRepository.save(inquiry)
        emailNotificationService.sendInquiryNotification(saved)
        return toResponse(saved)
    }

    fun getAllInquiries(): List<ContactInquiryResponse> {
        return contactInquiryRepository.findAllByOrderByCreatedAtDesc().map { toResponse(it) }
    }

    fun markAsRead(id: Long): ContactInquiryResponse {
        val inquiry = contactInquiryRepository.findById(id)
            .orElseThrow { IllegalArgumentException("Inquiry not found") }
        inquiry.read = true
        return toResponse(contactInquiryRepository.save(inquiry))
    }

    fun deleteInquiry(id: Long) {
        contactInquiryRepository.deleteById(id)
    }

    private fun toResponse(inquiry: ContactInquiry) = ContactInquiryResponse(
        id = inquiry.id,
        name = inquiry.name,
        email = inquiry.email,
        phone = inquiry.phone,
        inquiryType = inquiry.inquiryType,
        message = inquiry.message,
        read = inquiry.read,
        createdAt = inquiry.createdAt
    )
}
