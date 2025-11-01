package com.bus.senegal.dto;

import java.math.BigDecimal;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalyticsResponse {
    
    private Long totalBookings;
    private Long completedBookings;
    private Long cancelledBookings;
    private Long pendingBookings;
    
    private BigDecimal totalRevenue;
    private BigDecimal monthlyRevenue;
    private BigDecimal averageBookingValue;
    
    private Long totalTrips;
    private Long activeTrips;
    private Long completedTrips;
    
    private Long totalCompanies;
    private Long activeCompanies;
    
    private Double averageOccupancyRate;
    
    // Top routes by bookings
    private Map<String, Long> topRoutes;
    
    // Bookings per day for the last 30 days
    private Map<String, Long> bookingsTrend;
}

