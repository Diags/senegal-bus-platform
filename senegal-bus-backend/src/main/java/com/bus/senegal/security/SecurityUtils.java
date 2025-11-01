package com.bus.senegal.security;

import java.util.Optional;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class SecurityUtils {
    
    public static Optional<String> getCurrentUserKeycloakId() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.getPrincipal() instanceof Jwt jwt) {
                String userId = jwt.getSubject();
                return Optional.of(userId);
            }
        } catch (Exception e) {
            log.error("Error extracting user ID from security context", e);
        }
        return Optional.empty();
    }
    
    public static Optional<String> getCurrentUserEmail() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.getPrincipal() instanceof Jwt jwt) {
                String email = jwt.getClaim("email");
                return Optional.ofNullable(email);
            }
        } catch (Exception e) {
            log.error("Error extracting email from security context", e);
        }
        return Optional.empty();
    }
    
    public static boolean hasRole(String role) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            return authentication != null && 
                   authentication.getAuthorities().stream()
                       .anyMatch(authority -> authority.getAuthority().equals("ROLE_" + role));
        } catch (Exception e) {
            log.error("Error checking role", e);
            return false;
        }
    }
}

