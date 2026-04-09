package com.hedoesit.bakery.dto

import java.time.LocalDateTime

data class ContactInquiryResponse(
    val id: Long,
    val name: String,
    val email: String,
    val phone: String?,
    val inquiryType: String,
    val message: String,
    val read: Boolean,
    val createdAt: LocalDateTime
)
