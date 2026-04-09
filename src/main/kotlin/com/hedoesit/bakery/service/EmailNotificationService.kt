package com.hedoesit.bakery.service

import com.hedoesit.bakery.model.ContactInquiry
import org.springframework.beans.factory.annotation.Value
import org.springframework.mail.SimpleMailMessage
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.stereotype.Service

@Service
class EmailNotificationService(
    private val mailSender: JavaMailSender,
    @Value("\${spring.mail.username:}") private val fromEmail: String,
    @Value("\${app.contact-email:}") private val contactEmail: String
) {
    fun sendInquiryNotification(inquiry: ContactInquiry) {
        if (fromEmail.isBlank() || contactEmail.isBlank()) return

        try {
            val message = SimpleMailMessage()
            message.from = fromEmail
            message.setTo(contactEmail)
            message.subject = "New Inquiry from ${inquiry.name} - ${inquiry.inquiryType}"
            message.text = """
                New contact inquiry received:

                Name: ${inquiry.name}
                Email: ${inquiry.email}
                Phone: ${inquiry.phone ?: "Not provided"}
                Type: ${inquiry.inquiryType}

                Message:
                ${inquiry.message}
            """.trimIndent()
            mailSender.send(message)
        } catch (e: Exception) {
            println("Failed to send inquiry notification: ${e.message}")
        }
    }

    fun sendSubscriptionConfirmation(email: String) {
        if (fromEmail.isBlank()) return

        try {
            val message = SimpleMailMessage()
            message.from = fromEmail
            message.setTo(email)
            message.subject = "Welcome to heDoesIt!"
            message.text = """
                Thank you for your interest in heDoesIt!

                We're working hard to bring you the finest baked goods.
                You'll be the first to know when we launch.

                Stay sweet,
                The heDoesIt Team
            """.trimIndent()
            mailSender.send(message)
        } catch (e: Exception) {
            println("Failed to send subscription confirmation: ${e.message}")
        }
    }
}
