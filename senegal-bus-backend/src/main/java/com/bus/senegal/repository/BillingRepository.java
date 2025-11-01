package com.bus.senegal.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.bus.senegal.model.Billing;

@Repository
public interface BillingRepository extends JpaRepository<Billing, Long> {
    
    Optional<Billing> findByInvoiceNumber(String invoiceNumber);
    
    List<Billing> findByCompanyId(Long companyId);
    
    @Query("SELECT b FROM Billing b WHERE b.company.id = :companyId ORDER BY b.billingDate DESC")
    List<Billing> findCompanyBillingHistory(Long companyId);
    
    List<Billing> findByStatus(Billing.BillingStatus status);
    
    List<Billing> findByBillingType(Billing.BillingType billingType);
}

