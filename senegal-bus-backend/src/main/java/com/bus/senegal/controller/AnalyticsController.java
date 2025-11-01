package com.bus.senegal.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bus.senegal.dto.AnalyticsResponse;
import com.bus.senegal.service.AnalyticsService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/analytics")
@RequiredArgsConstructor
@Slf4j
public class AnalyticsController {
    
    private final AnalyticsService analyticsService;
    
    @GetMapping("/global")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AnalyticsResponse> getGlobalAnalytics() {
        log.info("REST request to get global analytics");
        AnalyticsResponse analytics = analyticsService.getGlobalAnalytics();
        return ResponseEntity.ok(analytics);
    }
    
    @GetMapping("/company/{companyId}")
    @PreAuthorize("hasAnyRole('COMPAGNIE', 'ADMIN')")
    public ResponseEntity<AnalyticsResponse> getCompanyAnalytics(@PathVariable Long companyId) {
        log.info("REST request to get analytics for company: {}", companyId);
        AnalyticsResponse analytics = analyticsService.getCompanyAnalytics(companyId);
        return ResponseEntity.ok(analytics);
    }
    
    @GetMapping("/tenant")
    @PreAuthorize("hasRole('COMPAGNIE')")
    public ResponseEntity<AnalyticsResponse> getTenantAnalytics() {
        log.info("REST request to get tenant analytics");
        AnalyticsResponse analytics = analyticsService.getTenantAnalytics();
        return ResponseEntity.ok(analytics);
    }
}

