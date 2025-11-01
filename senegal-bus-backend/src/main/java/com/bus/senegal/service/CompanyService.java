package com.bus.senegal.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bus.senegal.dto.CompanyRequest;
import com.bus.senegal.dto.CompanyResponse;
import com.bus.senegal.exception.ResourceNotFoundException;
import com.bus.senegal.model.Company;
import com.bus.senegal.repository.CompanyRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class CompanyService {
    
    private final CompanyRepository companyRepository;
    
    @Transactional
    public CompanyResponse createCompany(CompanyRequest request) {
        log.info("Creating new company: {}", request.getName());
        
        Company company = Company.builder()
                .name(request.getName())
                .description(request.getDescription())
                .logoUrl(request.getLogoUrl())
                .contactEmail(request.getContactEmail())
                .contactPhone(request.getContactPhone())
                .address(request.getAddress())
                .city(request.getCity())
                .subdomain(request.getSubdomain())
                .subscriptionStatus(Company.SubscriptionStatus.TRIAL)
                .build();
        
        Company saved = companyRepository.save(company);
        log.info("Company created with ID: {}", saved.getId());
        
        return mapToResponse(saved);
    }
    
    @Transactional(readOnly = true)
    public CompanyResponse getCompanyById(Long id) {
        log.debug("Fetching company with ID: {}", id);
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company", id));
        return mapToResponse(company);
    }
    
    @Transactional(readOnly = true)
    public List<CompanyResponse> getAllCompanies() {
        log.debug("Fetching all companies");
        return companyRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }
    
    @Transactional
    public CompanyResponse updateCompany(Long id, CompanyRequest request) {
        log.info("Updating company with ID: {}", id);
        
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company", id));
        
        company.setName(request.getName());
        company.setDescription(request.getDescription());
        company.setLogoUrl(request.getLogoUrl());
        company.setContactEmail(request.getContactEmail());
        company.setContactPhone(request.getContactPhone());
        company.setAddress(request.getAddress());
        company.setCity(request.getCity());
        company.setSubdomain(request.getSubdomain());
        
        Company updated = companyRepository.save(company);
        log.info("Company updated: {}", id);
        
        return mapToResponse(updated);
    }
    
    @Transactional
    public void suspendCompany(Long id) {
        log.warn("Suspending company with ID: {}", id);
        
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company", id));
        
        company.setSubscriptionStatus(Company.SubscriptionStatus.SUSPENDED);
        companyRepository.save(company);
        
        log.info("Company suspended: {}", id);
    }
    
    @Transactional
    public void activateCompany(Long id) {
        log.info("Activating company with ID: {}", id);
        
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company", id));
        
        company.setSubscriptionStatus(Company.SubscriptionStatus.ACTIVE);
        companyRepository.save(company);
        
        log.info("Company activated: {}", id);
    }
    
    @Transactional
    public void deleteCompany(Long id) {
        log.warn("Deleting company with ID: {}", id);
        
        if (!companyRepository.existsById(id)) {
            throw new ResourceNotFoundException("Company", id);
        }
        
        companyRepository.deleteById(id);
        log.info("Company deleted: {}", id);
    }
    
    private CompanyResponse mapToResponse(Company company) {
        return CompanyResponse.builder()
                .id(company.getId())
                .name(company.getName())
                .description(company.getDescription())
                .logoUrl(company.getLogoUrl())
                .contactEmail(company.getContactEmail())
                .contactPhone(company.getContactPhone())
                .address(company.getAddress())
                .city(company.getCity())
                .subscriptionStatus(company.getSubscriptionStatus().name())
                .subdomain(company.getSubdomain())
                .createdAt(company.getCreatedAt())
                .updatedAt(company.getUpdatedAt())
                .build();
    }
}

