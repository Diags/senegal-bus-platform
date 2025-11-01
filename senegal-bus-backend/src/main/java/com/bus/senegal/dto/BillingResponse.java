package com.bus.senegal.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BillingResponse {
    
    private Long id;
    private Long companyId;
    private String companyName;
    private String invoiceNumber;
    private String billingType;
    private BigDecimal amount;
    private String status;
    private LocalDateTime billingDate;
    private LocalDateTime dueDate;
    private LocalDateTime paidDate;
    private String paymentReference;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

