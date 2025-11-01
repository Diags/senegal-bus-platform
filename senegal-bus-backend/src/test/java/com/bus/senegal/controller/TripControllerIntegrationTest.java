package com.bus.senegal.controller;

import com.bus.senegal.AbstractIntegrationTest;
import com.bus.senegal.dto.TripRequest;
import com.bus.senegal.dto.TripSearchRequest;
import com.bus.senegal.model.*;
import com.bus.senegal.repository.*;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

@DisplayName("TripController Integration Tests")
class TripControllerIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private RouteRepository routeRepository;

    @Autowired
    private BusRepository busRepository;

    @Autowired
    private CompanyRepository companyRepository;

    private Company testCompany;
    private Route testRoute;
    private Bus testBus;
    private Trip testTrip;

    @BeforeEach
    void setUpTestData() {
        testCompany = Company.builder()
                .name("Test Company")
                .email("test@company.sn")
                .phone("+221338234567")
                .address("Dakar")
                .subscriptionStatus(Company.SubscriptionStatus.ACTIVE)
                .subdomain("test-company")
                .build();
        testCompany = companyRepository.save(testCompany);

        testRoute = Route.builder()
                .departureCity("Dakar")
                .arrivalCity("Saint-Louis")
                .distance(270.0)
                .estimatedDuration(240)
                .build();
        testRoute = routeRepository.save(testRoute);

        testBus = Bus.builder()
                .registrationNumber("DK-TEST-01")
                .brand("Mercedes")
                .model("Sprinter")
                .totalSeats(50)
                .company(testCompany)
                .build();
        testBus = busRepository.save(testBus);

        testTrip = Trip.builder()
                .route(testRoute)
                .bus(testBus)
                .departureDateTime(LocalDateTime.now().plusDays(2))
                .arrivalDateTime(LocalDateTime.now().plusDays(2).plusHours(4))
                .price(15000.0)
                .availableSeats(50)
                .status(Trip.TripStatus.SCHEDULED)
                .build();
        testTrip = tripRepository.save(testTrip);
    }

    @AfterEach
    void cleanUp() {
        tripRepository.deleteAll();
        busRepository.deleteAll();
        routeRepository.deleteAll();
        companyRepository.deleteAll();
    }

    @Test
    @DisplayName("Should search trips successfully")
    void testSearchTrips() {
        TripSearchRequest searchRequest = TripSearchRequest.builder()
                .departureCity("Dakar")
                .arrivalCity("Saint-Louis")
                .departureDate(LocalDateTime.now().plusDays(2).format(DateTimeFormatter.ISO_LOCAL_DATE))
                .passengers(2)
                .build();

        given()
                .contentType(ContentType.JSON)
                .body(searchRequest)
        .when()
                .post("/trips/search")
        .then()
                .statusCode(HttpStatus.OK.value())
                .body("$", hasSize(greaterThanOrEqualTo(1)))
                .body("[0].departureCity", equalTo("Dakar"))
                .body("[0].arrivalCity", equalTo("Saint-Louis"));
    }

    @Test
    @DisplayName("Should get trip by ID")
    void testGetTripById() {
        given()
                .contentType(ContentType.JSON)
        .when()
                .get("/trips/{id}", testTrip.getId())
        .then()
                .statusCode(HttpStatus.OK.value())
                .body("id", equalTo(testTrip.getId().intValue()))
                .body("departureCity", equalTo("Dakar"))
                .body("arrivalCity", equalTo("Saint-Louis"))
                .body("price", equalTo(15000.0f));
    }

    @Test
    @DisplayName("Should return 404 when trip not found")
    void testGetTripByIdNotFound() {
        given()
                .contentType(ContentType.JSON)
        .when()
                .get("/trips/{id}", 999L)
        .then()
                .statusCode(HttpStatus.NOT_FOUND.value())
                .body("message", containsString("Trip not found"));
    }

    @Test
    @DisplayName("Should check trip availability")
    void testCheckTripAvailability() {
        given()
                .contentType(ContentType.JSON)
                .queryParam("seats", 5)
        .when()
                .get("/trips/{id}/availability", testTrip.getId())
        .then()
                .statusCode(HttpStatus.OK.value())
                .body(equalTo("true"));
    }

    @Test
    @DisplayName("Should return false when requesting more seats than available")
    void testCheckAvailabilityInsufficientSeats() {
        given()
                .contentType(ContentType.JSON)
                .queryParam("seats", 100)
        .when()
                .get("/trips/{id}/availability", testTrip.getId())
        .then()
                .statusCode(HttpStatus.OK.value())
                .body(equalTo("false"));
    }

    @Test
    @DisplayName("Should get trips by company ID")
    void testGetTripsByCompanyId() {
        given()
                .contentType(ContentType.JSON)
        .when()
                .get("/trips/company/{companyId}", testCompany.getId())
        .then()
                .statusCode(HttpStatus.OK.value())
                .body("$", hasSize(greaterThanOrEqualTo(1)));
    }

    @Test
    @DisplayName("Should return empty list when no trips for company")
    void testGetTripsByCompanyIdNoTrips() {
        given()
                .contentType(ContentType.JSON)
        .when()
                .get("/trips/company/{companyId}", 999L)
        .then()
                .statusCode(HttpStatus.OK.value())
                .body("$", hasSize(0));
    }

    @Test
    @DisplayName("Should return empty list when searching with no matches")
    void testSearchTripsNoResults() {
        TripSearchRequest searchRequest = TripSearchRequest.builder()
                .departureCity("InvalidCity")
                .arrivalCity("AnotherInvalidCity")
                .departureDate(LocalDateTime.now().plusDays(1).format(DateTimeFormatter.ISO_LOCAL_DATE))
                .passengers(1)
                .build();

        given()
                .contentType(ContentType.JSON)
                .body(searchRequest)
        .when()
                .post("/trips/search")
        .then()
                .statusCode(HttpStatus.OK.value())
                .body("$", hasSize(0));
    }
}

