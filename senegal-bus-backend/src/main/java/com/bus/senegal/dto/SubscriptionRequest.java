package com.bus.senegal.dto;

import java.math.BigDecimal;

import com.bus.senegal.model.Subscription;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubscriptionRequest {
    
    @NotNull(message = "Company ID is required")
    private Long companyId;
    
    @NotNull(message = "Subscription plan is required")
    private Subscription.SubscriptionPlan plan;
    
    @NotNull(message = "Monthly price is required")
    @Positive(message = "Monthly price must be positive")
    private BigDecimal monthlyPrice;
    
    @Positive(message = "Commission percentage must be positive")
    private BigDecimal commissionPercentage;
    
    private Integer maxTripsPerMonth;
    
    private Integer maxBuses;
    
    @NotNull(message = "Duration in months is required")
    private Integer durationMonths;
}

