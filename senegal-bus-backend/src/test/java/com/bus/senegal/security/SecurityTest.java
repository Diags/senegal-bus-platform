package com.bus.senegal.security;

import com.bus.senegal.AbstractIntegrationTest;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.containsString;

@DisplayName("Security Tests")
class SecurityTest extends AbstractIntegrationTest {

    @Test
    @DisplayName("Should return 401 when accessing protected endpoint without JWT")
    void testUnauthorizedAccess() {
        given()
                .contentType(ContentType.JSON)
        .when()
                .get("/companies")
        .then()
                .statusCode(HttpStatus.UNAUTHORIZED.value());
    }

    @Test
    @DisplayName("Should return 401 for invalid JWT token")
    void testInvalidJWT() {
        given()
                .contentType(ContentType.JSON)
                .header("Authorization", "Bearer invalid_token_here")
        .when()
                .get("/companies")
        .then()
                .statusCode(HttpStatus.UNAUTHORIZED.value());
    }

    @Test
    @DisplayName("Should allow access to public endpoints without authentication")
    void testPublicEndpointsAccess() {
        given()
                .contentType(ContentType.JSON)
        .when()
                .post("/trips/search")
                .then()
                // May return 400 for missing body, but not 401
                .statusCode(org.hamcrest.Matchers.not(HttpStatus.UNAUTHORIZED.value()));
    }

    @Test
    @DisplayName("Should protect admin endpoints")
    void testAdminEndpointsProtection() {
        given()
                .contentType(ContentType.JSON)
        .when()
                .get("/analytics/platform")
        .then()
                .statusCode(HttpStatus.UNAUTHORIZED.value());
    }

    @Test
    @DisplayName("Should protect company endpoints")
    void testCompanyEndpointsProtection() {
        given()
                .contentType(ContentType.JSON)
        .when()
                .post("/trips")
        .then()
                .statusCode(HttpStatus.UNAUTHORIZED.value());
    }
}

