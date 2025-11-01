package com.bus.senegal.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "billings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Billing {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;
    
    @Column(nullable = false, unique = true)
    private String invoiceNumber;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BillingType billingType;
    
    @Column(nullable = false)
    private BigDecimal amount;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BillingStatus status = BillingStatus.PENDING;
    
    private LocalDateTime billingDate;
    
    private LocalDateTime dueDate;
    
    private LocalDateTime paidDate;
    
    private String paymentReference;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum BillingType {
        SUBSCRIPTION,
        COMMISSION,
        TRANSACTION_FEE
    }
    
    public enum BillingStatus {
        PENDING,
        PAID,
        CANCELLED,
        OVERDUE,
        REFUNDED
    }
}

