package com.bus.senegal.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyRequest {
    
    @NotBlank(message = "Company name is required")
    private String name;
    
    private String description;
    
    private String logoUrl;
    
    @Email(message = "Invalid email format")
    private String contactEmail;
    
    private String contactPhone;
    
    private String address;
    
    private String city;
    
    @NotBlank(message = "Subdomain is required")
    private String subdomain;
}

