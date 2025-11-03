package com.bus.senegal.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingRequest {
    
    @NotNull(message = "Trip ID is required")
    private Long tripId;
    
    // Optional - will auto-select if not provided
    private Long seatId;
    
    @NotNull(message = "Number of seats is required")
    private Integer numberOfSeats = 1;
}

