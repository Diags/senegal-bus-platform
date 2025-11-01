package com.bus.senegal.controller;

import com.bus.senegal.AbstractIntegrationTest;
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

@DisplayName("PaymentController Integration Tests")
class PaymentControllerIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BusRepository busRepository;

    @Autowired
    private RouteRepository routeRepository;

    @Autowired
    private CompanyRepository companyRepository;

    private Payment testPayment;
    private Booking testBooking;

    @BeforeEach
    void setUpTestData() {
        User user = User.builder()
                .email("payment@test.com")
                .firstName("Payment")
                .lastName("Test")
                .phoneNumber("+221771234567")
                .password("password")
                .role(User.Role.PASSAGER)
                .build();
        user = userRepository.save(user);

        Company company = Company.builder()
                .name("Payment Test Company")
                .email("payment@company.sn")
                .phone("+221338234567")
                .address("Dakar")
                .subscriptionStatus(Company.SubscriptionStatus.ACTIVE)
                .subdomain("payment-test")
                .build();
        company = companyRepository.save(company);

        Bus bus = Bus.builder()
                .registrationNumber("DK-PAY-01")
                .brand("Mercedes")
                .model("Sprinter")
                .totalSeats(50)
                .company(company)
                .build();
        bus = busRepository.save(bus);

        Route route = Route.builder()
                .departureCity("Dakar")
                .arrivalCity("Kaolack")
                .distance(200.0)
                .estimatedDuration(180)
                .build();
        route = routeRepository.save(route);

        Trip trip = Trip.builder()
                .route(route)
                .bus(bus)
                .departureDateTime(LocalDateTime.now().plusDays(4))
                .arrivalDateTime(LocalDateTime.now().plusDays(4).plusHours(3))
                .price(10000.0)
                .availableSeats(50)
                .status(Trip.TripStatus.SCHEDULED)
                .build();
        trip = tripRepository.save(trip);

        testBooking = Booking.builder()
                .bookingNumber("BUS000100")
                .user(user)
                .trip(trip)
                .numberOfSeats(1)
                .status(Booking.BookingStatus.PENDING)
                .build();
        testBooking = bookingRepository.save(testBooking);

        testPayment = Payment.builder()
                .transactionId("TXN123456789")
                .booking(testBooking)
                .bookingNumber("BUS000100")
                .paymentMethod(Payment.PaymentMethod.ORANGE_MONEY)
                .amount(10000.0)
                .status(Payment.PaymentStatus.PENDING)
                .provider("ORANGE_MONEY")
                .build();
        testPayment = paymentRepository.save(testPayment);
    }

    @AfterEach
    void cleanUp() {
        paymentRepository.deleteAll();
        bookingRepository.deleteAll();
        tripRepository.deleteAll();
        busRepository.deleteAll();
        routeRepository.deleteAll();
        companyRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    @DisplayName("Should get payment by transaction ID")
    void testGetPaymentByTransactionId() {
        given()
                .contentType(ContentType.JSON)
        .when()
                .get("/payments/transaction/{transactionId}", testPayment.getTransactionId())
        .then()
                .statusCode(HttpStatus.OK.value())
                .body("transactionId", equalTo("TXN123456789"))
                .body("amount", equalTo(10000.0f))
                .body("status", equalTo("PENDING"))
                .body("provider", equalTo("ORANGE_MONEY"));
    }

    @Test
    @DisplayName("Should return 404 when payment not found")
    void testGetPaymentByTransactionIdNotFound() {
        given()
                .contentType(ContentType.JSON)
        .when()
                .get("/payments/transaction/{transactionId}", "INVALID_TXN")
        .then()
                .statusCode(HttpStatus.NOT_FOUND.value())
                .body("message", containsString("Payment not found"));
    }

    @Test
    @DisplayName("Should get payment status")
    void testGetPaymentStatus() {
        given()
                .contentType(ContentType.JSON)
        .when()
                .get("/payments/{transactionId}/status", testPayment.getTransactionId())
        .then()
                .statusCode(HttpStatus.OK.value())
                .body(equalTo("PENDING"));
    }

    @Test
    @DisplayName("Should handle webhook callback")
    void testHandleWebhookCallback() {
        given()
                .contentType(ContentType.JSON)
                .queryParam("transactionId", testPayment.getTransactionId())
                .queryParam("status", "SUCCESS")
                .queryParam("message", "Payment completed")
        .when()
                .post("/payments/webhook/callback")
        .then()
                .statusCode(HttpStatus.OK.value());

        // Verify payment status was updated
        given()
                .contentType(ContentType.JSON)
        .when()
                .get("/payments/{transactionId}/status", testPayment.getTransactionId())
        .then()
                .statusCode(HttpStatus.OK.value())
                .body(equalTo("COMPLETED"));
    }

    @Test
    @DisplayName("Should get payments by booking ID")
    void testGetPaymentsByBookingId() {
        given()
                .contentType(ContentType.JSON)
        .when()
                .get("/payments/booking/{bookingId}", testBooking.getId())
        .then()
                .statusCode(HttpStatus.OK.value())
                .body("$", hasSize(greaterThanOrEqualTo(1)))
                .body("[0].bookingNumber", equalTo("BUS000100"));
    }

    @Test
    @DisplayName("Should return empty list for booking with no payments")
    void testGetPaymentsByBookingIdNoPayments() {
        given()
                .contentType(ContentType.JSON)
        .when()
                .get("/payments/booking/{bookingId}", 999L)
        .then()
                .statusCode(HttpStatus.OK.value())
                .body("$", hasSize(0));
    }
}

