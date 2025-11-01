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
public class PaymentResponse {
    
    private Long id;
    private String transactionId;
    
    private Long bookingId;
    private String bookingNumber;
    
    private String paymentMethod;
    private BigDecimal amount;
    private String status;
    private String provider;
    
    private String paymentUrl;
    private String qrCode;
    private String message;
    
    private LocalDateTime paidAt;
    private LocalDateTime createdAt;
}

