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
public class CompanyResponse {
    
    private Long id;
    private String name;
    private String description;
    private String logoUrl;
    private String contactEmail;
    private String contactPhone;
    private String address;
    private String city;
    private String subscriptionStatus;
    private String subdomain;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

