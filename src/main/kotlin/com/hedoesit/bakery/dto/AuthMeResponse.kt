package com.hedoesit.bakery.dto

data class AuthMeResponse(
    val email: String,
    val name: String,
    val isAdmin: Boolean
)
