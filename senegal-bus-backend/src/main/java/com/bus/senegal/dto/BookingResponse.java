package com.bus.senegal.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingResponse {
    
    private Long id;
    private String bookingNumber;
    
    private Long userId;
    private String userName;
    private String userEmail;
    
    private TripResponse trip;
    
    private String seatNumber;
    private Integer numberOfSeats;
    private String status;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

