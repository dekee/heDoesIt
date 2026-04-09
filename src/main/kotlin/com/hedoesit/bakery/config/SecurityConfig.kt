package com.hedoesit.bakery.config

import com.hedoesit.bakery.security.GoogleAuthFilter
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter

@Configuration
@EnableWebSecurity
class SecurityConfig(
    private val googleAuthFilter: GoogleAuthFilter
) {
    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .csrf { it.disable() }
            .sessionManagement { it.sessionCreationPolicy(SessionCreationPolicy.STATELESS) }
            .exceptionHandling {
                it.authenticationEntryPoint { _: HttpServletRequest, response: HttpServletResponse, _ ->
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Authentication required")
                }
            }
            .authorizeHttpRequests { auth ->
                auth.requestMatchers("/api/admin/**").hasRole("ADMIN")
                auth.requestMatchers("/api/auth/**").permitAll()
                auth.requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
                auth.requestMatchers(HttpMethod.GET, "/api/categories/**").permitAll()
                auth.requestMatchers(HttpMethod.GET, "/api/images/**").permitAll()
                auth.requestMatchers(HttpMethod.GET, "/api/health").permitAll()
                auth.requestMatchers(HttpMethod.POST, "/api/contact").permitAll()
                auth.requestMatchers(HttpMethod.POST, "/api/subscribe").permitAll()
                auth.requestMatchers("/api/**").hasRole("ADMIN")
                auth.anyRequest().permitAll()
            }
            .addFilterBefore(googleAuthFilter, UsernamePasswordAuthenticationFilter::class.java)

        return http.build()
    }
}
