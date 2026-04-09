package com.hedoesit.bakery.dto

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class ContactInquiryRequest(
    @field:NotBlank val name: String,
    @field:NotBlank @field:Email val email: String,
    val phone: String? = null,
    val inquiryType: String = "GENERAL",
    @field:NotBlank @field:Size(max = 2000) val message: String
)
