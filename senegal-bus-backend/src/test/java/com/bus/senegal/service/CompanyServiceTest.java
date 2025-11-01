package com.bus.senegal.service;

import com.bus.senegal.dto.CompanyRequest;
import com.bus.senegal.dto.CompanyResponse;
import com.bus.senegal.exception.ResourceNotFoundException;
import com.bus.senegal.exception.ValidationException;
import com.bus.senegal.model.Company;
import com.bus.senegal.repository.CompanyRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("CompanyService Unit Tests")
class CompanyServiceTest {

    @Mock
    private CompanyRepository companyRepository;

    @InjectMocks
    private CompanyService companyService;

    private Company testCompany;
    private CompanyRequest testRequest;

    @BeforeEach
    void setUp() {
        testCompany = Company.builder()
                .id(1L)
                .name("Dakar Dem Dikk")
                .email("contact@ddd.sn")
                .phone("+221338234567")
                .address("Dakar, Sénégal")
                .subscriptionStatus(Company.SubscriptionStatus.ACTIVE)
                .subdomain("ddd")
                .build();

        testRequest = CompanyRequest.builder()
                .name("Dakar Dem Dikk")
                .email("contact@ddd.sn")
                .phone("+221338234567")
                .address("Dakar, Sénégal")
                .build();
    }

    @Test
    @DisplayName("Should create company successfully")
    void testCreateCompany() {
        // Given
        when(companyRepository.save(any(Company.class))).thenReturn(testCompany);

        // When
        CompanyResponse response = companyService.createCompany(testRequest);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getName()).isEqualTo("Dakar Dem Dikk");
        assertThat(response.getEmail()).isEqualTo("contact@ddd.sn");
        verify(companyRepository, times(1)).save(any(Company.class));
    }

    @Test
    @DisplayName("Should throw exception when creating company with duplicate email")
    void testCreateCompanyWithDuplicateEmail() {
        // Given
        when(companyRepository.save(any(Company.class)))
                .thenThrow(new ValidationException("Email already exists"));

        // When & Then
        assertThatThrownBy(() -> companyService.createCompany(testRequest))
                .isInstanceOf(ValidationException.class)
                .hasMessageContaining("Email already exists");
    }

    @Test
    @DisplayName("Should get company by ID successfully")
    void testGetCompanyById() {
        // Given
        when(companyRepository.findById(1L)).thenReturn(Optional.of(testCompany));

        // When
        CompanyResponse response = companyService.getCompanyById(1L);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getName()).isEqualTo("Dakar Dem Dikk");
        verify(companyRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Should throw exception when company not found")
    void testGetCompanyByIdNotFound() {
        // Given
        when(companyRepository.findById(anyLong())).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> companyService.getCompanyById(999L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Company not found");
    }

    @Test
    @DisplayName("Should get all companies successfully")
    void testGetAllCompanies() {
        // Given
        List<Company> companies = List.of(testCompany);
        when(companyRepository.findAll()).thenReturn(companies);

        // When
        List<CompanyResponse> responses = companyService.getAllCompanies();

        // Then
        assertThat(responses).hasSize(1);
        assertThat(responses.get(0).getName()).isEqualTo("Dakar Dem Dikk");
        verify(companyRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Should update company successfully")
    void testUpdateCompany() {
        // Given
        when(companyRepository.findById(1L)).thenReturn(Optional.of(testCompany));
        when(companyRepository.save(any(Company.class))).thenReturn(testCompany);

        CompanyRequest updateRequest = CompanyRequest.builder()
                .name("Updated Company Name")
                .email("updated@ddd.sn")
                .phone("+221338888888")
                .address("New Address")
                .build();

        // When
        CompanyResponse response = companyService.updateCompany(1L, updateRequest);

        // Then
        assertThat(response).isNotNull();
        verify(companyRepository, times(1)).findById(1L);
        verify(companyRepository, times(1)).save(any(Company.class));
    }

    @Test
    @DisplayName("Should delete company successfully")
    void testDeleteCompany() {
        // Given
        when(companyRepository.findById(1L)).thenReturn(Optional.of(testCompany));
        doNothing().when(companyRepository).delete(testCompany);

        // When
        companyService.deleteCompany(1L);

        // Then
        verify(companyRepository, times(1)).findById(1L);
        verify(companyRepository, times(1)).delete(testCompany);
    }

    @Test
    @DisplayName("Should get companies by subscription status")
    void testGetCompaniesBySubscriptionStatus() {
        // Given
        List<Company> companies = List.of(testCompany);
        when(companyRepository.findBySubscriptionStatus(Company.SubscriptionStatus.ACTIVE))
                .thenReturn(companies);

        // When
        List<CompanyResponse> responses = companyService.getCompaniesByStatus(Company.SubscriptionStatus.ACTIVE);

        // Then
        assertThat(responses).hasSize(1);
        assertThat(responses.get(0).getSubscriptionStatus()).isEqualTo(Company.SubscriptionStatus.ACTIVE);
        verify(companyRepository, times(1)).findBySubscriptionStatus(Company.SubscriptionStatus.ACTIVE);
    }
}


