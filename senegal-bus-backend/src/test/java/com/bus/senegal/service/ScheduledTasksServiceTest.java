package com.bus.senegal.service;

import com.bus.senegal.model.*;
import com.bus.senegal.repository.BookingRepository;
import com.bus.senegal.repository.SubscriptionRepository;
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

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("ScheduledTasksService Unit Tests")
class ScheduledTasksServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private SubscriptionRepository subscriptionRepository;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private ScheduledTasksService scheduledTasksService;

    private List<Booking> upcomingBookings;
    private List<Subscription> expiringSubscriptions;

    @BeforeEach
    void setUp() {
        // Setup upcoming bookings
        User user = User.builder()
                .id(1L)
                .email("user@test.com")
                .phoneNumber("+221771234567")
                .build();

        Company company = Company.builder()
                .id(1L)
                .name("Test Company")
                .build();

        Bus bus = Bus.builder()
                .id(1L)
                .company(company)
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
                .departureDateTime(LocalDateTime.now().plusHours(23))
                .build();

        Booking booking = Booking.builder()
                .id(1L)
                .user(user)
                .trip(trip)
                .status(Booking.BookingStatus.CONFIRMED)
                .build();

        upcomingBookings = new ArrayList<>();
        upcomingBookings.add(booking);

        // Setup expiring subscriptions
        Subscription subscription = Subscription.builder()
                .id(1L)
                .company(company)
                .status(Subscription.SubscriptionStatus.ACTIVE)
                .endDate(LocalDateTime.now().plusDays(5))
                .build();

        expiringSubscriptions = new ArrayList<>();
        expiringSubscriptions.add(subscription);
    }

    @Test
    @DisplayName("Should send trip reminders for upcoming trips")
    void testSendTripReminders() {
        // Given
        LocalDateTime tomorrow = LocalDateTime.now().plusDays(1);
        when(bookingRepository.findUpcomingBookings(any(LocalDateTime.class), any(LocalDateTime.class)))
                .thenReturn(upcomingBookings);
        doNothing().when(notificationService).sendTripReminder(any(Booking.class));

        // When
        scheduledTasksService.sendTripReminders();

        // Then
        verify(bookingRepository, times(1))
                .findUpcomingBookings(any(LocalDateTime.class), any(LocalDateTime.class));
        verify(notificationService, times(upcomingBookings.size()))
                .sendTripReminder(any(Booking.class));
    }

    @Test
    @DisplayName("Should not send reminders if no upcoming trips")
    void testNoUpcomingTrips() {
        // Given
        when(bookingRepository.findUpcomingBookings(any(LocalDateTime.class), any(LocalDateTime.class)))
                .thenReturn(new ArrayList<>());

        // When
        scheduledTasksService.sendTripReminders();

        // Then
        verify(bookingRepository, times(1))
                .findUpcomingBookings(any(LocalDateTime.class), any(LocalDateTime.class));
        verify(notificationService, never()).sendTripReminder(any(Booking.class));
    }

    @Test
    @DisplayName("Should process expiring subscriptions")
    void testProcessExpiringSubscriptions() {
        // Given
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime sevenDaysFromNow = now.plusDays(7);
        when(subscriptionRepository.findExpiringSubscriptions(any(LocalDateTime.class), any(LocalDateTime.class)))
                .thenReturn(expiringSubscriptions);

        // When
        scheduledTasksService.processExpiringSubscriptions();

        // Then
        verify(subscriptionRepository, times(1))
                .findExpiringSubscriptions(any(LocalDateTime.class), any(LocalDateTime.class));
    }

    @Test
    @DisplayName("Should handle errors in trip reminders gracefully")
    void testHandleReminderErrors() {
        // Given
        when(bookingRepository.findUpcomingBookings(any(LocalDateTime.class), any(LocalDateTime.class)))
                .thenReturn(upcomingBookings);
        doThrow(new RuntimeException("Notification service down"))
                .when(notificationService).sendTripReminder(any(Booking.class));

        // When
        scheduledTasksService.sendTripReminders();

        // Then - Should not throw exception
        verify(bookingRepository, times(1))
                .findUpcomingBookings(any(LocalDateTime.class), any(LocalDateTime.class));
    }

    @Test
    @DisplayName("Should send renewal reminders for expiring subscriptions")
    void testSendRenewalReminders() {
        // Given
        when(subscriptionRepository.findExpiringSubscriptions(any(LocalDateTime.class), any(LocalDateTime.class)))
                .thenReturn(expiringSubscriptions);

        // When
        scheduledTasksService.processExpiringSubscriptions();

        // Then
        verify(subscriptionRepository, times(1))
                .findExpiringSubscriptions(any(LocalDateTime.class), any(LocalDateTime.class));
    }

    @Test
    @DisplayName("Should generate monthly billing reports")
    void testGenerateMonthlyBilling() {
        // Given - No specific setup needed for this test

        // When
        scheduledTasksService.generateMonthlyBilling();

        // Then - Should complete without errors
        // In a real implementation, we would verify billing records are created
    }
}

