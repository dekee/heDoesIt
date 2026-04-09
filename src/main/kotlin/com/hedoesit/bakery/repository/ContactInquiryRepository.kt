package com.hedoesit.bakery.repository

import com.hedoesit.bakery.model.ContactInquiry
import org.springframework.data.jpa.repository.JpaRepository

interface ContactInquiryRepository : JpaRepository<ContactInquiry, Long> {
    fun findAllByOrderByCreatedAtDesc(): List<ContactInquiry>
}
