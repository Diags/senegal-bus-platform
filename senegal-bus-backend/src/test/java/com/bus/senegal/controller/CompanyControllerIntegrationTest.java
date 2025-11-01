package com.bus.senegal.controller;

import com.bus.senegal.AbstractIntegrationTest;
import com.bus.senegal.dto.CompanyRequest;
import com.bus.senegal.model.Company;
import com.bus.senegal.repository.CompanyRepository;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

@DisplayName("CompanyController Integration Tests")
class CompanyControllerIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private CompanyRepository companyRepository;

    private Company testCompany;

    @BeforeEach
    void setUpTestData() {
        testCompany = Company.builder()
                .name("Test Company")
                .email("test@company.sn")
                .phone("+221338234567")
                .address("Dakar, Sénégal")
                .subscriptionStatus(Company.SubscriptionStatus.ACTIVE)
                .subdomain("test-company")
                .build();

        testCompany = companyRepository.save(testCompany);
    }

    @AfterEach
    void cleanUp() {
        companyRepository.deleteAll();
    }

    @Test
    @DisplayName("Should create company successfully")
    void testCreateCompany() {
        CompanyRequest request = CompanyRequest.builder()
                .name("New Company")
                .email("new@company.sn")
                .phone("+221771234567")
                .address("Saint-Louis, Sénégal")
                .build();

        given()
                .contentType(ContentType.JSON)
                .body(request)
        .when()
                .post("/api/companies")
        .then()
                .statusCode(HttpStatus.CREATED.value())
                .body("name", equalTo("New Company"))
                .body("email", equalTo("new@company.sn"))
                .body("subscriptionStatus", equalTo("TRIAL"));
    }

    @Test
    @DisplayName("Should get all companies")
    void testGetAllCompanies() {
        given()
                .contentType(ContentType.JSON)
        .when()
                .get("/api/companies")
        .then()
                .statusCode(HttpStatus.OK.value())
                .body("$", hasSize(greaterThanOrEqualTo(1)))
                .body("[0].name", equalTo("Test Company"));
    }

    @Test
    @DisplayName("Should get company by ID")
    void testGetCompanyById() {
        given()
                .contentType(ContentType.JSON)
        .when()
                .get("/api/companies/{id}", testCompany.getId())
        .then()
                .statusCode(HttpStatus.OK.value())
                .body("id", equalTo(testCompany.getId().intValue()))
                .body("name", equalTo("Test Company"))
                .body("email", equalTo("test@company.sn"));
    }

    @Test
    @DisplayName("Should return 404 when company not found")
    void testGetCompanyByIdNotFound() {
        given()
                .contentType(ContentType.JSON)
        .when()
                .get("/api/companies/{id}", 999L)
        .then()
                .statusCode(HttpStatus.NOT_FOUND.value())
                .body("message", containsString("Company not found"));
    }

    @Test
    @DisplayName("Should update company successfully")
    void testUpdateCompany() {
        CompanyRequest updateRequest = CompanyRequest.builder()
                .name("Updated Company")
                .email("updated@company.sn")
                .phone("+221771111111")
                .address("Updated Address")
                .build();

        given()
                .contentType(ContentType.JSON)
                .body(updateRequest)
        .when()
                .put("/api/companies/{id}", testCompany.getId())
        .then()
                .statusCode(HttpStatus.OK.value())
                .body("name", equalTo("Updated Company"))
                .body("email", equalTo("updated@company.sn"));
    }

    @Test
    @DisplayName("Should delete company successfully")
    void testDeleteCompany() {
        given()
                .contentType(ContentType.JSON)
        .when()
                .delete("/api/companies/{id}", testCompany.getId())
        .then()
                .statusCode(HttpStatus.NO_CONTENT.value());

        // Verify deletion
        given()
                .contentType(ContentType.JSON)
        .when()
                .get("/api/companies/{id}", testCompany.getId())
        .then()
                .statusCode(HttpStatus.NOT_FOUND.value());
    }

    @Test
    @DisplayName("Should return 400 when creating company with invalid data")
    void testCreateCompanyWithInvalidData() {
        CompanyRequest invalidRequest = CompanyRequest.builder()
                .name("") // Empty name
                .email("invalid-email") // Invalid email format
                .build();

        given()
                .contentType(ContentType.JSON)
                .body(invalidRequest)
        .when()
                .post("/api/companies")
        .then()
                .statusCode(HttpStatus.BAD_REQUEST.value());
    }

    @Test
    @DisplayName("Should get companies by subscription status")
    void testGetCompaniesByStatus() {
        given()
                .contentType(ContentType.JSON)
                .queryParam("status", "ACTIVE")
        .when()
                .get("/api/companies/status")
        .then()
                .statusCode(HttpStatus.OK.value())
                .body("$", hasSize(greaterThanOrEqualTo(1)))
                .body("[0].subscriptionStatus", equalTo("ACTIVE"));
    }
}


