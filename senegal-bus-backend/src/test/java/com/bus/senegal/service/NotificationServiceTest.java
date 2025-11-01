package com.bus.senegal.service;

import com.bus.senegal.model.Booking;
import com.bus.senegal.model.Notification;
import com.bus.senegal.model.User;
import com.bus.senegal.repository.NotificationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("NotificationService Unit Tests")
class NotificationServiceTest {

    @Mock
    private NotificationRepository notificationRepository;

    @InjectMocks
    private NotificationService notificationService;

    private User testUser;
    private Booking testBooking;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .email("user@test.com")
                .firstName("Test")
                .lastName("User")
                .phoneNumber("+221771234567")
                .build();

        testBooking = Booking.builder()
                .id(1L)
                .bookingNumber("BUS000001")
                .user(testUser)
                .build();
    }

    @Test
    @DisplayName("Should send booking confirmation notification")
    void testSendBookingConfirmation() {
        // Given
        when(notificationRepository.save(any(Notification.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        // When
        notificationService.sendBookingConfirmation(testBooking);

        // Then
        verify(notificationRepository, atLeast(1)).save(any(Notification.class));
    }

    @Test
    @DisplayName("Should send SMS notification successfully")
    void testSendSMS() {
        // Given
        String message = "Test SMS message";
        when(notificationRepository.save(any(Notification.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        // When
        notificationService.sendBookingConfirmation(testBooking);

        // Then
        verify(notificationRepository, atLeast(1)).save(argThat(notification ->
                notification.getType() == Notification.NotificationType.SMS &&
                notification.getRecipient().equals(testUser.getPhoneNumber())
        ));
    }

    @Test
    @DisplayName("Should send Email notification successfully")
    void testSendEmail() {
        // Given
        when(notificationRepository.save(any(Notification.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        // When
        notificationService.sendBookingConfirmation(testBooking);

        // Then
        verify(notificationRepository, atLeast(1)).save(argThat(notification ->
                notification.getType() == Notification.NotificationType.EMAIL &&
                notification.getRecipient().equals(testUser.getEmail())
        ));
    }

    @Test
    @DisplayName("Should send WhatsApp notification successfully")
    void testSendWhatsApp() {
        // Given
        when(notificationRepository.save(any(Notification.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        // When
        notificationService.sendBookingConfirmation(testBooking);

        // Then
        verify(notificationRepository, atLeast(1)).save(argThat(notification ->
                notification.getType() == Notification.NotificationType.WHATSAPP &&
                notification.getRecipient().equals(testUser.getPhoneNumber())
        ));
    }

    @Test
    @DisplayName("Should handle SMS sending failure")
    void testSMSFailure() {
        // Given
        when(notificationRepository.save(any(Notification.class)))
                .thenThrow(new RuntimeException("SMS service unavailable"));

        // When
        notificationService.sendBookingConfirmation(testBooking);

        // Then - Should not throw exception, should handle gracefully
        verify(notificationRepository, atLeastOnce()).save(any(Notification.class));
    }

    @Test
    @DisplayName("Should save failed notification with error details")
    void testSaveFailedNotification() {
        // Given
        when(notificationRepository.save(any(Notification.class)))
                .thenAnswer(invocation -> {
                    Notification notif = invocation.getArgument(0);
                    if (notif.getStatus() == Notification.NotificationStatus.FAILED) {
                        return notif;
                    }
                    throw new RuntimeException("Simulated failure");
                });

        // When
        notificationService.sendBookingConfirmation(testBooking);

        // Then
        verify(notificationRepository, atLeast(1)).save(argThat(notification ->
                notification.getStatus() == Notification.NotificationStatus.FAILED
        ));
    }

    @Test
    @DisplayName("Should send payment confirmation notification")
    void testSendPaymentConfirmation() {
        // Given
        when(notificationRepository.save(any(Notification.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        // When
        notificationService.sendPaymentConfirmation(testBooking);

        // Then
        verify(notificationRepository, atLeast(1)).save(any(Notification.class));
    }

    @Test
    @DisplayName("Should send trip reminder notification")
    void testSendTripReminder() {
        // Given
        when(notificationRepository.save(any(Notification.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        // When
        notificationService.sendTripReminder(testBooking);

        // Then
        verify(notificationRepository, atLeast(1)).save(any(Notification.class));
    }
}

