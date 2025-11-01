package com.bus.senegal.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TripSearchRequest {
    
    @NotBlank(message = "Departure city is required")
    private String departureCity;
    
    @NotBlank(message = "Arrival city is required")
    private String arrivalCity;
    
    @NotNull(message = "Departure date is required")
    private LocalDate departureDate;
    
    private Integer passengers = 1;
}

