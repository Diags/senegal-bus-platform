package com.bus.senegal.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bus.senegal.dto.SubscriptionRequest;
import com.bus.senegal.dto.SubscriptionResponse;
import com.bus.senegal.service.SubscriptionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/subscriptions")
@RequiredArgsConstructor
@Validated
@Slf4j
public class SubscriptionController {
    
    private final SubscriptionService subscriptionService;
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SubscriptionResponse> createSubscription(@Valid @RequestBody SubscriptionRequest request) {
        log.info("REST request to create subscription for company: {}", request.getCompanyId());
        SubscriptionResponse response = subscriptionService.createSubscription(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('COMPAGNIE', 'ADMIN')")
    public ResponseEntity<SubscriptionResponse> getSubscription(@PathVariable Long id) {
        log.info("REST request to get subscription: {}", id);
        SubscriptionResponse response = subscriptionService.getSubscriptionById(id);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/company/{companyId}")
    @PreAuthorize("hasAnyRole('COMPAGNIE', 'ADMIN')")
    public ResponseEntity<List<SubscriptionResponse>> getCompanySubscriptions(@PathVariable Long companyId) {
        log.info("REST request to get subscriptions for company: {}", companyId);
        List<SubscriptionResponse> subscriptions = subscriptionService.getSubscriptionsByCompany(companyId);
        return ResponseEntity.ok(subscriptions);
    }
    
    @GetMapping("/company/{companyId}/active")
    @PreAuthorize("hasAnyRole('COMPAGNIE', 'ADMIN')")
    public ResponseEntity<SubscriptionResponse> getActiveSubscription(@PathVariable Long companyId) {
        log.info("REST request to get active subscription for company: {}", companyId);
        SubscriptionResponse response = subscriptionService.getActiveSubscriptionByCompany(companyId);
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/{id}/renew")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SubscriptionResponse> renewSubscription(
            @PathVariable Long id,
            @RequestParam(defaultValue = "12") Integer durationMonths) {
        log.info("REST request to renew subscription: {}", id);
        SubscriptionResponse response = subscriptionService.renewSubscription(id, durationMonths);
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> cancelSubscription(@PathVariable Long id) {
        log.info("REST request to cancel subscription: {}", id);
        subscriptionService.cancelSubscription(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/company/{companyId}/check-limits")
    @PreAuthorize("hasAnyRole('COMPAGNIE', 'ADMIN')")
    public ResponseEntity<Boolean> checkLimits(@PathVariable Long companyId) {
        log.info("REST request to check subscription limits for company: {}", companyId);
        boolean withinLimits = subscriptionService.checkSubscriptionLimits(companyId);
        return ResponseEntity.ok(withinLimits);
    }
}

