package com.bus.senegal.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

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
public class TripRequest {
    
    @NotNull(message = "Route ID is required")
    private Long routeId;
    
    @NotNull(message = "Bus ID is required")
    private Long busId;
    
    @NotNull(message = "Departure date/time is required")
    private LocalDateTime departureDateTime;
    
    @NotNull(message = "Arrival date/time is required")
    private LocalDateTime arrivalDateTime;
    
    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private BigDecimal price;
}

