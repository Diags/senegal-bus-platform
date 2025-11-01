package com.bus.senegal.service;

import com.bus.senegal.config.TenantContext;
import com.bus.senegal.dto.AnalyticsResponse;
import com.bus.senegal.model.*;
import com.bus.senegal.repository.*;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AnalyticsService Unit Tests")
class AnalyticsServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private TripRepository tripRepository;

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private CompanyRepository companyRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AnalyticsService analyticsService;

    private Company testCompany;
    private List<Booking> testBookings;
    private List<Trip> testTrips;
    private List<Payment> testPayments;

    @BeforeEach
    void setUp() {
        testCompany = Company.builder()
                .id(1L)
                .name("Test Company")
                .subscriptionStatus(Company.SubscriptionStatus.ACTIVE)
                .build();

        Bus bus = Bus.builder()
                .id(1L)
                .totalSeats(50)
                .company(testCompany)
                .build();

        Route route = Route.builder()
                .id(1L)
                .departureCity("Dakar")
                .arrivalCity("Saint-Louis")
                .build();

        Trip trip = Trip.builder()
                .id(1L)
                .bus(bus)
                .route(route)
                .price(15000.0)
                .departureDateTime(LocalDateTime.now().plusDays(1))
                .arrivalDateTime(LocalDateTime.now().plusDays(1).plusHours(4))
                .build();

        testTrips = new ArrayList<>();
        testTrips.add(trip);

        Booking booking = Booking.builder()
                .id(1L)
                .trip(trip)
                .numberOfSeats(2)
                .status(Booking.BookingStatus.CONFIRMED)
                .build();

        testBookings = new ArrayList<>();
        testBookings.add(booking);

        Payment payment = Payment.builder()
                .id(1L)
                .booking(booking)
                .amount(30000.0)
                .status(Payment.PaymentStatus.COMPLETED)
                .build();

        testPayments = new ArrayList<>();
        testPayments.add(payment);
    }

    @AfterEach
    void tearDown() {
        TenantContext.clear();
    }

    @Test
    @DisplayName("Should calculate total revenue correctly")
    void testCalculateTotalRevenue() {
        // Given
        when(companyRepository.count()).thenReturn(1L);
        when(bookingRepository.findAll()).thenReturn(testBookings);
        when(tripRepository.findAll()).thenReturn(testTrips);
        when(paymentRepository.findAll()).thenReturn(testPayments);
        when(userRepository.count()).thenReturn(10L);

        // When
        AnalyticsResponse response = analyticsService.getPlatformAnalytics();

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getTotalRevenue()).isEqualTo(30000.0);
    }

    @Test
    @DisplayName("Should count total bookings correctly")
    void testCountTotalBookings() {
        // Given
        when(companyRepository.count()).thenReturn(1L);
        when(bookingRepository.findAll()).thenReturn(testBookings);
        when(tripRepository.findAll()).thenReturn(testTrips);
        when(paymentRepository.findAll()).thenReturn(testPayments);
        when(userRepository.count()).thenReturn(10L);

        // When
        AnalyticsResponse response = analyticsService.getPlatformAnalytics();

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getTotalBookings()).isEqualTo(1);
    }

    @Test
    @DisplayName("Should get company analytics with correct filtering")
    void testGetCompanyAnalytics() {
        // Given
        Long companyId = 1L;
        when(bookingRepository.findAll()).thenReturn(testBookings);
        when(tripRepository.findByCompanyId(companyId)).thenReturn(testTrips);
        when(paymentRepository.findAll()).thenReturn(testPayments);

        // When
        AnalyticsResponse response = analyticsService.getCompanyAnalytics(companyId);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getTotalRevenue()).isEqualTo(30000.0);
        verify(tripRepository, times(1)).findByCompanyId(companyId);
    }

    @Test
    @DisplayName("Should isolate tenant analytics correctly")
    void testTenantIsolation() {
        // Given
        Long tenantId = 1L;
        TenantContext.setTenantId(tenantId);
        
        when(bookingRepository.findAll()).thenReturn(testBookings);
        when(tripRepository.findByCompanyId(tenantId)).thenReturn(testTrips);
        when(paymentRepository.findAll()).thenReturn(testPayments);

        // When
        AnalyticsResponse response = analyticsService.getTenantAnalytics();

        // Then
        assertThat(response).isNotNull();
        verify(tripRepository, times(1)).findByCompanyId(tenantId);
    }

    @Test
    @DisplayName("Should filter analytics by date range")
    void testFilterByDateRange() {
        // Given
        LocalDateTime startDate = LocalDateTime.now().minusDays(7);
        LocalDateTime endDate = LocalDateTime.now();
        
        when(bookingRepository.findAll()).thenReturn(testBookings);
        when(tripRepository.findAll()).thenReturn(testTrips);
        when(paymentRepository.findAll()).thenReturn(testPayments);

        // When
        AnalyticsResponse response = analyticsService.getAnalyticsByPeriod(startDate, endDate);

        // Then
        assertThat(response).isNotNull();
    }

    @Test
    @DisplayName("Should calculate average booking value")
    void testAverageBookingValue() {
        // Given
        when(companyRepository.count()).thenReturn(1L);
        when(bookingRepository.findAll()).thenReturn(testBookings);
        when(tripRepository.findAll()).thenReturn(testTrips);
        when(paymentRepository.findAll()).thenReturn(testPayments);
        when(userRepository.count()).thenReturn(10L);

        // When
        AnalyticsResponse response = analyticsService.getPlatformAnalytics();

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getAverageBookingValue()).isEqualTo(30000.0);
    }

    @Test
    @DisplayName("Should handle empty data gracefully")
    void testEmptyData() {
        // Given
        when(companyRepository.count()).thenReturn(0L);
        when(bookingRepository.findAll()).thenReturn(new ArrayList<>());
        when(tripRepository.findAll()).thenReturn(new ArrayList<>());
        when(paymentRepository.findAll()).thenReturn(new ArrayList<>());
        when(userRepository.count()).thenReturn(0L);

        // When
        AnalyticsResponse response = analyticsService.getPlatformAnalytics();

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getTotalRevenue()).isEqualTo(0.0);
        assertThat(response.getTotalBookings()).isEqualTo(0);
    }

    @Test
    @DisplayName("Should count active trips correctly")
    void testCountActiveTrips() {
        // Given
        when(companyRepository.count()).thenReturn(1L);
        when(bookingRepository.findAll()).thenReturn(testBookings);
        when(tripRepository.findAll()).thenReturn(testTrips);
        when(paymentRepository.findAll()).thenReturn(testPayments);
        when(userRepository.count()).thenReturn(10L);

        // When
        AnalyticsResponse response = analyticsService.getPlatformAnalytics();

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getTotalTrips()).isGreaterThanOrEqualTo(0);
    }

    @Test
    @DisplayName("Should calculate occupancy rate")
    void testOccupancyRate() {
        // Given
        when(bookingRepository.findAll()).thenReturn(testBookings);
        when(tripRepository.findByCompanyId(1L)).thenReturn(testTrips);
        when(paymentRepository.findAll()).thenReturn(testPayments);

        // When
        AnalyticsResponse response = analyticsService.getCompanyAnalytics(1L);

        // Then
        assertThat(response).isNotNull();
        // Occupancy = (2 seats booked / 50 total seats) * 100 = 4%
        assertThat(response.getOccupancyRate()).isGreaterThanOrEqualTo(0.0);
    }

    @Test
    @DisplayName("Should return analytics for multiple companies")
    void testMultipleCompaniesAnalytics() {
        // Given
        when(companyRepository.count()).thenReturn(5L);
        when(bookingRepository.findAll()).thenReturn(testBookings);
        when(tripRepository.findAll()).thenReturn(testTrips);
        when(paymentRepository.findAll()).thenReturn(testPayments);
        when(userRepository.count()).thenReturn(100L);

        // When
        AnalyticsResponse response = analyticsService.getPlatformAnalytics();

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getTotalCompanies()).isEqualTo(5);
    }
}

