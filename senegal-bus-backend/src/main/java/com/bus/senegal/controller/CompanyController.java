package com.bus.senegal.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bus.senegal.dto.CompanyRequest;
import com.bus.senegal.dto.CompanyResponse;
import com.bus.senegal.service.CompanyService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/companies")
@RequiredArgsConstructor
@Validated
@Slf4j
public class CompanyController {
    
    private final CompanyService companyService;
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CompanyResponse> createCompany(@Valid @RequestBody CompanyRequest request) {
        log.info("REST request to create company: {}", request.getName());
        CompanyResponse response = companyService.createCompany(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('COMPAGNIE', 'ADMIN')")
    public ResponseEntity<CompanyResponse> getCompany(@PathVariable Long id) {
        log.info("REST request to get company: {}", id);
        CompanyResponse response = companyService.getCompanyById(id);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CompanyResponse>> getAllCompanies() {
        log.info("REST request to get all companies");
        List<CompanyResponse> companies = companyService.getAllCompanies();
        return ResponseEntity.ok(companies);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('COMPAGNIE', 'ADMIN')")
    public ResponseEntity<CompanyResponse> updateCompany(
            @PathVariable Long id,
            @Valid @RequestBody CompanyRequest request) {
        log.info("REST request to update company: {}", id);
        CompanyResponse response = companyService.updateCompany(id, request);
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/{id}/suspend")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> suspendCompany(@PathVariable Long id) {
        log.info("REST request to suspend company: {}", id);
        companyService.suspendCompany(id);
        return ResponseEntity.noContent().build();
    }
    
    @PutMapping("/{id}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> activateCompany(@PathVariable Long id) {
        log.info("REST request to activate company: {}", id);
        companyService.activateCompany(id);
        return ResponseEntity.noContent().build();
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCompany(@PathVariable Long id) {
        log.info("REST request to delete company: {}", id);
        companyService.deleteCompany(id);
        return ResponseEntity.noContent().build();
    }
}

