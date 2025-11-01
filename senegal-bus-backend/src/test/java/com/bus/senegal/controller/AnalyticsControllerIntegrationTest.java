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

@DisplayName("AnalyticsController Integration Tests")
class AnalyticsControllerIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BusRepository busRepository;

    @Autowired
    private RouteRepository routeRepository;

    private Company testCompany;

    @BeforeEach
    void setUpTestData() {
        testCompany = Company.builder()
                .name("Analytics Test Company")
                .email("analytics@company.sn")
                .phone("+221338234567")
                .address("Dakar")
                .subscriptionStatus(Company.SubscriptionStatus.ACTIVE)
                .subdomain("analytics")
                .build();
        testCompany = companyRepository.save(testCompany);

        User user = User.builder()
                .email("analytics@test.com")
                .firstName("Analytics")
                .lastName("User")
                .phoneNumber("+221771234567")
                .password("password")
                .role(User.Role.PASSAGER)
                .build();
        user = userRepository.save(user);

        Bus bus = Bus.builder()
                .registrationNumber("DK-ANA-01")
                .brand("Mercedes")
                .model("Sprinter")
                .totalSeats(50)
                .company(testCompany)
                .build();
        bus = busRepository.save(bus);

        Route route = Route.builder()
                .departureCity("Dakar")
                .arrivalCity("Ziguinchor")
                .distance(450.0)
                .estimatedDuration(480)
                .build();
        route = routeRepository.save(route);

        Trip trip = Trip.builder()
                .route(route)
                .bus(bus)
                .departureDateTime(LocalDateTime.now().plusDays(5))
                .arrivalDateTime(LocalDateTime.now().plusDays(5).plusHours(8))
                .price(25000.0)
                .availableSeats(48)
                .status(Trip.TripStatus.SCHEDULED)
                .build();
        trip = tripRepository.save(trip);

        Booking booking = Booking.builder()
                .bookingNumber("BUS000200")
                .user(user)
                .trip(trip)
                .numberOfSeats(2)
                .status(Booking.BookingStatus.CONFIRMED)
                .build();
        booking = bookingRepository.save(booking);

        Payment payment = Payment.builder()
                .transactionId("TXN_ANALYTICS_001")
                .booking(booking)
                .bookingNumber("BUS000200")
                .paymentMethod(Payment.PaymentMethod.WAVE)
                .amount(50000.0)
                .status(Payment.PaymentStatus.COMPLETED)
                .provider("WAVE")
                .build();
        paymentRepository.save(payment);
    }

    @AfterEach
    void cleanUp() {
        paymentRepository.deleteAll();
        bookingRepository.deleteAll();
        tripRepository.deleteAll();
        busRepository.deleteAll();
        routeRepository.deleteAll();
        userRepository.deleteAll();
        companyRepository.deleteAll();
    }

    @Test
    @DisplayName("Should get platform analytics")
    void testGetPlatformAnalytics() {
        given()
                .contentType(ContentType.JSON)
        .when()
                .get("/analytics/platform")
        .then()
                .statusCode(HttpStatus.OK.value())
                .body("totalRevenue", greaterThanOrEqualTo(0.0f))
                .body("totalBookings", greaterThanOrEqualTo(0))
                .body("totalTrips", greaterThanOrEqualTo(0))
                .body("totalCompanies", greaterThanOrEqualTo(1));
    }

    @Test
    @DisplayName("Should get company analytics")
    void testGetCompanyAnalytics() {
        given()
                .contentType(ContentType.JSON)
        .when()
                .get("/analytics/company/{companyId}", testCompany.getId())
        .then()
                .statusCode(HttpStatus.OK.value())
                .body("totalRevenue", greaterThanOrEqualTo(0.0f))
                .body("totalBookings", greaterThanOrEqualTo(0))
                .body("totalTrips", greaterThanOrEqualTo(1));
    }

    @Test
    @DisplayName("Should return analytics with zero values for company with no data")
    void testGetCompanyAnalyticsNoData() {
        given()
                .contentType(ContentType.JSON)
        .when()
                .get("/analytics/company/{companyId}", 999L)
        .then()
                .statusCode(HttpStatus.OK.value())
                .body("totalRevenue", equalTo(0.0f))
                .body("totalBookings", equalTo(0))
                .body("totalTrips", equalTo(0));
    }

    @Test
    @DisplayName("Should get analytics by period")
    void testGetAnalyticsByPeriod() {
        String startDate = LocalDateTime.now().minusDays(1).toString();
        String endDate = LocalDateTime.now().plusDays(10).toString();

        given()
                .contentType(ContentType.JSON)
                .queryParam("startDate", startDate)
                .queryParam("endDate", endDate)
        .when()
                .get("/analytics/period")
        .then()
                .statusCode(HttpStatus.OK.value())
                .body("totalRevenue", greaterThanOrEqualTo(0.0f));
    }

    @Test
    @DisplayName("Should calculate occupancy rate correctly")
    void testOccupancyRate() {
        given()
                .contentType(ContentType.JSON)
        .when()
                .get("/analytics/company/{companyId}", testCompany.getId())
        .then()
                .statusCode(HttpStatus.OK.value())
                .body("occupancyRate", greaterThanOrEqualTo(0.0f))
                .body("occupancyRate", lessThanOrEqualTo(100.0f));
    }

    @Test
    @DisplayName("Should get revenue metrics")
    void testRevenueMetrics() {
        given()
                .contentType(ContentType.JSON)
        .when()
                .get("/analytics/platform")
        .then()
                .statusCode(HttpStatus.OK.value())
                .body("totalRevenue", greaterThanOrEqualTo(50000.0f))
                .body("averageBookingValue", greaterThanOrEqualTo(0.0f));
    }
}

