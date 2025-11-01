package com.bus.senegal.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bus.senegal.dto.BillingResponse;
import com.bus.senegal.exception.ResourceNotFoundException;
import com.bus.senegal.model.Billing;
import com.bus.senegal.model.Company;
import com.bus.senegal.repository.BillingRepository;
import com.bus.senegal.repository.CompanyRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class BillingService {
    
    private final BillingRepository billingRepository;
    private final CompanyRepository companyRepository;
    
    @Transactional
    public BillingResponse createBilling(Long companyId, Billing.BillingType type, BigDecimal amount) {
        log.info("Creating billing for company: {} type: {}", companyId, type);
        
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company", companyId));
        
        String invoiceNumber = generateInvoiceNumber();
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime dueDate = now.plusDays(30); // 30 days payment term
        
        Billing billing = Billing.builder()
                .company(company)
                .invoiceNumber(invoiceNumber)
                .billingType(type)
                .amount(amount)
                .status(Billing.BillingStatus.PENDING)
                .billingDate(now)
                .dueDate(dueDate)
                .build();
        
        Billing saved = billingRepository.save(billing);
        log.info("Billing created: {}", invoiceNumber);
        
        return mapToResponse(saved);
    }
    
    @Transactional(readOnly = true)
    public BillingResponse getBillingById(Long id) {
        log.debug("Fetching billing: {}", id);
        Billing billing = billingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Billing", id));
        return mapToResponse(billing);
    }
    
    @Transactional(readOnly = true)
    public BillingResponse getBillingByInvoiceNumber(String invoiceNumber) {
        log.debug("Fetching billing by invoice: {}", invoiceNumber);
        Billing billing = billingRepository.findByInvoiceNumber(invoiceNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Billing not found: " + invoiceNumber));
        return mapToResponse(billing);
    }
    
    @Transactional(readOnly = true)
    public List<BillingResponse> getCompanyBillings(Long companyId) {
        log.debug("Fetching billings for company: {}", companyId);
        return billingRepository.findCompanyBillingHistory(companyId).stream()
                .map(this::mapToResponse)
                .toList();
    }
    
    @Transactional(readOnly = true)
    public List<BillingResponse> getPendingBillings() {
        log.debug("Fetching pending billings");
        return billingRepository.findByStatus(Billing.BillingStatus.PENDING).stream()
                .map(this::mapToResponse)
                .toList();
    }
    
    @Transactional
    public BillingResponse markAsPaid(Long id, String paymentReference) {
        log.info("Marking billing as paid: {}", id);
        
        Billing billing = billingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Billing", id));
        
        billing.setStatus(Billing.BillingStatus.PAID);
        billing.setPaidDate(LocalDateTime.now());
        billing.setPaymentReference(paymentReference);
        
        Billing updated = billingRepository.save(billing);
        log.info("Billing marked as paid: {}", billing.getInvoiceNumber());
        
        return mapToResponse(updated);
    }
    
    @Transactional
    public void markAsOverdue(Long id) {
        log.warn("Marking billing as overdue: {}", id);
        
        Billing billing = billingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Billing", id));
        
        billing.setStatus(Billing.BillingStatus.OVERDUE);
        billingRepository.save(billing);
    }
    
    @Transactional
    public BigDecimal calculateMonthlyRevenue() {
        LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0);
        LocalDateTime endOfMonth = startOfMonth.plusMonths(1);
        
        return billingRepository.findAll().stream()
                .filter(b -> b.getStatus() == Billing.BillingStatus.PAID)
                .filter(b -> b.getPaidDate() != null)
                .filter(b -> b.getPaidDate().isAfter(startOfMonth) && b.getPaidDate().isBefore(endOfMonth))
                .map(Billing::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
    
    private String generateInvoiceNumber() {
        return "INV-" + LocalDateTime.now().getYear() + "-" + 
               UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
    
    private BillingResponse mapToResponse(Billing billing) {
        return BillingResponse.builder()
                .id(billing.getId())
                .companyId(billing.getCompany().getId())
                .companyName(billing.getCompany().getName())
                .invoiceNumber(billing.getInvoiceNumber())
                .billingType(billing.getBillingType().name())
                .amount(billing.getAmount())
                .status(billing.getStatus().name())
                .billingDate(billing.getBillingDate())
                .dueDate(billing.getDueDate())
                .paidDate(billing.getPaidDate())
                .paymentReference(billing.getPaymentReference())
                .createdAt(billing.getCreatedAt())
                .updatedAt(billing.getUpdatedAt())
                .build();
    }
}

