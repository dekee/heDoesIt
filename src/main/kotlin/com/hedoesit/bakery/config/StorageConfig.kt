package com.hedoesit.bakery.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
class StorageConfig(
    @Value("\${app.upload-dir:./uploads}") private val uploadDir: String
) : WebMvcConfigurer {
    override fun addResourceHandlers(registry: ResourceHandlerRegistry) {
        registry.addResourceHandler("/api/images/**")
            .addResourceLocations("file:$uploadDir/products/")
    }
}
