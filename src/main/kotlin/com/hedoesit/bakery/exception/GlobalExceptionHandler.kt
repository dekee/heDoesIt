package com.hedoesit.bakery.exception

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice

@RestControllerAdvice
class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException::class)
    fun handleNotFound(ex: IllegalArgumentException): ResponseEntity<Map<String, String?>> {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(mapOf("error" to ex.message))
    }

    @ExceptionHandler(IllegalStateException::class)
    fun handleBadRequest(ex: IllegalStateException): ResponseEntity<Map<String, String?>> {
        return ResponseEntity.badRequest()
            .body(mapOf("error" to ex.message))
    }

    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleValidation(ex: MethodArgumentNotValidException): ResponseEntity<Map<String, Any>> {
        val errors = ex.bindingResult.fieldErrors.associate { it.field to (it.defaultMessage ?: "invalid") }
        return ResponseEntity.badRequest().body(mapOf("errors" to errors))
    }
}
