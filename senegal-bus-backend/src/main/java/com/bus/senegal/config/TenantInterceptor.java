package com.bus.senegal.config;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class TenantInterceptor implements HandlerInterceptor {
    
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            
            if (authentication != null && authentication.getPrincipal() instanceof Jwt jwt) {
                // Extraire le tenant_id depuis le JWT
                Object tenantIdClaim = jwt.getClaim("tenant_id");
                
                if (tenantIdClaim instanceof Long) {
                    TenantContext.setTenantId((Long) tenantIdClaim);
                    log.debug("Tenant context set to: {}", tenantIdClaim);
                } else if (tenantIdClaim instanceof Integer) {
                    TenantContext.setTenantId(((Integer) tenantIdClaim).longValue());
                    log.debug("Tenant context set to: {}", tenantIdClaim);
                } else if (tenantIdClaim instanceof String) {
                    try {
                        Long tenantId = Long.parseLong((String) tenantIdClaim);
                        TenantContext.setTenantId(tenantId);
                        log.debug("Tenant context set to: {}", tenantId);
                    } catch (NumberFormatException e) {
                        log.warn("Invalid tenant_id format in JWT: {}", tenantIdClaim);
                    }
                } else {
                    log.debug("No tenant_id found in JWT");
                }
            }
            
            return true;
        } catch (Exception e) {
            log.error("Error setting tenant context", e);
            return true;
        }
    }
    
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        TenantContext.clear();
    }
}

