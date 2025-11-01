package com.bus.senegal.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bus.senegal.dto.BillingResponse;
import com.bus.senegal.service.BillingService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/billings")
@RequiredArgsConstructor
@Validated
@Slf4j
public class BillingController {
    
    private final BillingService billingService;
    
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('COMPAGNIE', 'ADMIN')")
    public ResponseEntity<BillingResponse> getBilling(@PathVariable Long id) {
        log.info("REST request to get billing: {}", id);
        BillingResponse response = billingService.getBillingById(id);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/invoice/{invoiceNumber}")
    @PreAuthorize("hasAnyRole('COMPAGNIE', 'ADMIN')")
    public ResponseEntity<BillingResponse> getBillingByInvoice(@PathVariable String invoiceNumber) {
        log.info("REST request to get billing by invoice: {}", invoiceNumber);
        BillingResponse response = billingService.getBillingByInvoiceNumber(invoiceNumber);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/company/{companyId}")
    @PreAuthorize("hasAnyRole('COMPAGNIE', 'ADMIN')")
    public ResponseEntity<List<BillingResponse>> getCompanyBillings(@PathVariable Long companyId) {
        log.info("REST request to get billings for company: {}", companyId);
        List<BillingResponse> billings = billingService.getCompanyBillings(companyId);
        return ResponseEntity.ok(billings);
    }
    
    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BillingResponse>> getPendingBillings() {
        log.info("REST request to get pending billings");
        List<BillingResponse> billings = billingService.getPendingBillings();
        return ResponseEntity.ok(billings);
    }
    
    @PutMapping("/{id}/mark-paid")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BillingResponse> markAsPaid(
            @PathVariable Long id,
            @RequestParam String paymentReference) {
        log.info("REST request to mark billing as paid: {}", id);
        BillingResponse response = billingService.markAsPaid(id, paymentReference);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/revenue/monthly")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BigDecimal> getMonthlyRevenue() {
        log.info("REST request to get monthly revenue");
        BigDecimal revenue = billingService.calculateMonthlyRevenue();
        return ResponseEntity.ok(revenue);
    }
}

