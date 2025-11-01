package com.bus.senegal.controller;

import com.bus.senegal.AbstractIntegrationTest;
import com.bus.senegal.dto.BookingRequest;
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

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

@DisplayName("BookingController Integration Tests")
class BookingControllerIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SeatRepository seatRepository;

    @Autowired
    private BusRepository busRepository;

    @Autowired
    private RouteRepository routeRepository;

    @Autowired
    private CompanyRepository companyRepository;

    private User testUser;
    private Trip testTrip;
    private Seat testSeat;
    private Booking testBooking;

    @BeforeEach
    void setUpTestData() {
        testUser = User.builder()
                .email("user@test.com")
                .firstName("Test")
                .lastName("User")
                .phoneNumber("+221771234567")
                .password("password")
                .role(User.Role.PASSAGER)
                .build();
        testUser = userRepository.save(testUser);

        Company company = Company.builder()
                .name("Test Company")
                .email("company@test.sn")
                .phone("+221338234567")
                .address("Dakar")
                .subscriptionStatus(Company.SubscriptionStatus.ACTIVE)
                .subdomain("test")
                .build();
        company = companyRepository.save(company);

        Bus bus = Bus.builder()
                .registrationNumber("DK-TEST-02")
                .brand("Mercedes")
                .model("Sprinter")
                .totalSeats(50)
                .company(company)
                .build();
        bus = busRepository.save(bus);

        Route route = Route.builder()
                .departureCity("Dakar")
                .arrivalCity("Thiès")
                .distance(70.0)
                .estimatedDuration(60)
                .build();
        route = routeRepository.save(route);

        testTrip = Trip.builder()
                .route(route)
                .bus(bus)
                .departureDateTime(LocalDateTime.now().plusDays(3))
                .arrivalDateTime(LocalDateTime.now().plusDays(3).plusHours(1))
                .price(5000.0)
                .availableSeats(50)
                .status(Trip.TripStatus.SCHEDULED)
                .build();
        testTrip = tripRepository.save(testTrip);

        testSeat = Seat.builder()
                .bus(bus)
                .seatNumber("A1")
                .seatType(Seat.SeatType.STANDARD)
                .build();
        testSeat = seatRepository.save(testSeat);

        testBooking = Booking.builder()
                .bookingNumber("BUS000001")
                .user(testUser)
                .trip(testTrip)
                .seat(testSeat)
                .numberOfSeats(2)
                .status(Booking.BookingStatus.PENDING)
                .build();
        testBooking = bookingRepository.save(testBooking);
    }

    @AfterEach
    void cleanUp() {
        bookingRepository.deleteAll();
        seatRepository.deleteAll();
        tripRepository.deleteAll();
        busRepository.deleteAll();
        routeRepository.deleteAll();
        companyRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    @DisplayName("Should get booking by ID")
    void testGetBookingById() {
        given()
                .contentType(ContentType.JSON)
        .when()
                .get("/bookings/{id}", testBooking.getId())
        .then()
                .statusCode(HttpStatus.OK.value())
                .body("id", equalTo(testBooking.getId().intValue()))
                .body("bookingNumber", equalTo("BUS000001"))
                .body("numberOfSeats", equalTo(2))
                .body("status", equalTo("PENDING"));
    }

    @Test
    @DisplayName("Should return 404 when booking not found")
    void testGetBookingByIdNotFound() {
        given()
                .contentType(ContentType.JSON)
        .when()
                .get("/bookings/{id}", 999L)
        .then()
                .statusCode(HttpStatus.NOT_FOUND.value())
                .body("message", containsString("Booking not found"));
    }

    @Test
    @DisplayName("Should get user bookings")
    void testGetUserBookings() {
        given()
                .contentType(ContentType.JSON)
        .when()
                .get("/bookings/user/{userId}", testUser.getId())
        .then()
                .statusCode(HttpStatus.OK.value())
                .body("$", hasSize(greaterThanOrEqualTo(1)))
                .body("[0].bookingNumber", equalTo("BUS000001"));
    }

    @Test
    @DisplayName("Should return empty list for user with no bookings")
    void testGetUserBookingsNoBookings() {
        given()
                .contentType(ContentType.JSON)
        .when()
                .get("/bookings/user/{userId}", 999L)
        .then()
                .statusCode(HttpStatus.OK.value())
                .body("$", hasSize(0));
    }

    @Test
    @DisplayName("Should cancel booking successfully")
    void testCancelBooking() {
        given()
                .contentType(ContentType.JSON)
        .when()
                .put("/bookings/{id}/cancel", testBooking.getId())
        .then()
                .statusCode(HttpStatus.OK.value());

        // Verify booking is cancelled
        given()
                .contentType(ContentType.JSON)
        .when()
                .get("/bookings/{id}", testBooking.getId())
        .then()
                .statusCode(HttpStatus.OK.value())
                .body("status", equalTo("CANCELLED"));
    }

    @Test
    @DisplayName("Should confirm booking successfully")
    void testConfirmBooking() {
        given()
                .contentType(ContentType.JSON)
        .when()
                .put("/bookings/{id}/confirm", testBooking.getId())
        .then()
                .statusCode(HttpStatus.OK.value());

        // Verify booking is confirmed
        given()
                .contentType(ContentType.JSON)
        .when()
                .get("/bookings/{id}", testBooking.getId())
        .then()
                .statusCode(HttpStatus.OK.value())
                .body("status", equalTo("CONFIRMED"));
    }

    @Test
    @DisplayName("Should get bookings by status")
    void testGetBookingsByStatus() {
        given()
                .contentType(ContentType.JSON)
                .queryParam("status", "PENDING")
        .when()
                .get("/bookings/status")
        .then()
                .statusCode(HttpStatus.OK.value())
                .body("$", hasSize(greaterThanOrEqualTo(1)))
                .body("[0].status", equalTo("PENDING"));
    }

    @Test
    @DisplayName("Should return empty list when no bookings with status")
    void testGetBookingsByStatusNoResults() {
        given()
                .contentType(ContentType.JSON)
                .queryParam("status", "COMPLETED")
        .when()
                .get("/bookings/status")
        .then()
                .statusCode(HttpStatus.OK.value())
                .body("$", hasSize(0));
    }
}

