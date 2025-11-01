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
public class SubscriptionResponse {
    
    private Long id;
    private Long companyId;
    private String companyName;
    private String plan;
    private BigDecimal monthlyPrice;
    private BigDecimal commissionPercentage;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String status;
    private Integer maxTripsPerMonth;
    private Integer maxBuses;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

