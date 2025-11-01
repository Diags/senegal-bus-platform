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
public class TripResponse {
    
    private Long id;
    
    private Long routeId;
    private String departureCity;
    private String arrivalCity;
    
    private Long busId;
    private String busBrand;
    private String busModel;
    private Integer totalSeats;
    private Boolean hasWifi;
    private Boolean hasAC;
    private Boolean hasToilet;
    
    private String companyName;
    private String companyLogoUrl;
    
    private LocalDateTime departureDateTime;
    private LocalDateTime arrivalDateTime;
    
    private BigDecimal price;
    private Integer availableSeats;
    
    private String status;
}

