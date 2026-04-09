package com.hedoesit.bakery.dto

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank

data class SubscribeRequest(
    @field:NotBlank @field:Email val email: String
)
