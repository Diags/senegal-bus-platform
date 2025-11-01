package com.bus.senegal.service;

import com.bus.senegal.dto.PaymentRequest;
import com.bus.senegal.dto.PaymentResponse;
import com.bus.senegal.exception.PaymentException;
import com.bus.senegal.exception.ResourceNotFoundException;
import com.bus.senegal.model.*;
import com.bus.senegal.payment.PaymentProvider;
import com.bus.senegal.payment.PaymentProviderFactory;
import com.bus.senegal.repository.BookingRepository;
import com.bus.senegal.repository.PaymentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("PaymentService Unit Tests")
class PaymentServiceTest {

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private PaymentProviderFactory providerFactory;

    @Mock
    private PaymentProvider paymentProvider;

    @InjectMocks
    private PaymentService paymentService;

    private Booking testBooking;
    private Payment testPayment;

    @BeforeEach
    void setUp() {
        User testUser = User.builder()
                .id(1L)
                .email("user@test.com")
                .build();

        Company testCompany = Company.builder()
                .id(1L)
                .name("Test Company")
                .build();

        Bus testBus = Bus.builder()
                .id(1L)
                .company(testCompany)
                .build();

        Route testRoute = Route.builder()
                .id(1L)
                .departureCity("Dakar")
                .arrivalCity("Saint-Louis")
                .build();

        Trip testTrip = Trip.builder()
                .id(1L)
                .route(testRoute)
                .bus(testBus)
                .price(15000.0)
                .build();

        testBooking = Booking.builder()
                .id(1L)
                .bookingNumber("BUS000001")
                .user(testUser)
                .trip(testTrip)
                .numberOfSeats(2)
                .status(Booking.BookingStatus.PENDING)
                .build();

        testPayment = Payment.builder()
                .id(1L)
                .transactionId("TXN123456")
                .booking(testBooking)
                .bookingNumber("BUS000001")
                .paymentMethod(Payment.PaymentMethod.ORANGE_MONEY)
                .amount(30000.0)
                .status(Payment.PaymentStatus.PENDING)
                .provider("ORANGE_MONEY")
                .build();
    }

    @Test
    @DisplayName("Should initiate payment successfully")
    void testInitiatePayment() {
        // Given
        PaymentRequest request = PaymentRequest.builder()
                .bookingId(1L)
                .paymentMethod(Payment.PaymentMethod.ORANGE_MONEY)
                .build();

        PaymentResponse providerResponse = PaymentResponse.builder()
                .transactionId("TXN123456")
                .status(Payment.PaymentStatus.PENDING)
                .provider("ORANGE_MONEY")
                .paymentUrl("https://payment.orange.sn/pay/123")
                .build();

        when(bookingRepository.findById(1L)).thenReturn(Optional.of(testBooking));
        when(providerFactory.getProviderByMethod(Payment.PaymentMethod.ORANGE_MONEY))
                .thenReturn(paymentProvider);
        when(paymentProvider.isAvailable()).thenReturn(true);
        when(paymentProvider.initiatePayment(any(PaymentRequest.class)))
                .thenReturn(providerResponse);
        when(paymentProvider.getProviderName()).thenReturn("ORANGE_MONEY");

        // When
        PaymentResponse response = paymentService.initiatePayment(request);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getTransactionId()).isEqualTo("TXN123456");
        assertThat(response.getProvider()).isEqualTo("ORANGE_MONEY");
        verify(providerFactory, times(1)).getProviderByMethod(Payment.PaymentMethod.ORANGE_MONEY);
        verify(paymentProvider, times(1)).initiatePayment(any(PaymentRequest.class));
    }

    @Test
    @DisplayName("Should fallback to default provider when primary fails")
    void testInitiatePaymentWithFallback() {
        // Given
        PaymentRequest request = PaymentRequest.builder()
                .bookingId(1L)
                .paymentMethod(Payment.PaymentMethod.ORANGE_MONEY)
                .build();

        PaymentProvider fallbackProvider = mock(PaymentProvider.class);
        PaymentResponse fallbackResponse = PaymentResponse.builder()
                .transactionId("TXN_FALLBACK")
                .status(Payment.PaymentStatus.PENDING)
                .provider("PAYTECH")
                .build();

        when(bookingRepository.findById(1L)).thenReturn(Optional.of(testBooking));
        when(providerFactory.getProviderByMethod(Payment.PaymentMethod.ORANGE_MONEY))
                .thenReturn(paymentProvider);
        when(paymentProvider.isAvailable()).thenReturn(true);
        when(paymentProvider.initiatePayment(any(PaymentRequest.class)))
                .thenThrow(new PaymentException("Provider unavailable"));
        when(paymentProvider.getProviderName()).thenReturn("ORANGE_MONEY");
        when(providerFactory.getDefaultProvider()).thenReturn(fallbackProvider);
        when(fallbackProvider.initiatePayment(any(PaymentRequest.class)))
                .thenReturn(fallbackResponse);

        // When
        PaymentResponse response = paymentService.initiatePayment(request);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getProvider()).isEqualTo("PAYTECH");
        verify(providerFactory, times(1)).getDefaultProvider();
        verify(fallbackProvider, times(1)).initiatePayment(any(PaymentRequest.class));
    }

    @Test
    @DisplayName("Should throw exception when booking not found")
    void testInitiatePaymentBookingNotFound() {
        // Given
        PaymentRequest request = PaymentRequest.builder()
                .bookingId(999L)
                .paymentMethod(Payment.PaymentMethod.ORANGE_MONEY)
                .build();

        when(bookingRepository.findById(999L)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> paymentService.initiatePayment(request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Booking not found");
    }

    @Test
    @DisplayName("Should handle payment callback successfully")
    void testHandlePaymentCallback() {
        // Given
        when(paymentRepository.findByTransactionId("TXN123456"))
                .thenReturn(Optional.of(testPayment));
        when(paymentRepository.save(any(Payment.class))).thenReturn(testPayment);
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(testBooking));
        when(bookingRepository.save(any(Booking.class))).thenReturn(testBooking);

        // When
        paymentService.handlePaymentCallback("TXN123456", "SUCCESS", "Payment completed");

        // Then
        verify(paymentRepository, times(1)).findByTransactionId("TXN123456");
        verify(paymentRepository, times(1)).save(any(Payment.class));
        verify(bookingRepository, times(1)).save(any(Booking.class));
    }

    @Test
    @DisplayName("Should get payment by transaction ID")
    void testGetPaymentByTransactionId() {
        // Given
        when(paymentRepository.findByTransactionId("TXN123456"))
                .thenReturn(Optional.of(testPayment));

        // When
        PaymentResponse response = paymentService.getPaymentByTransactionId("TXN123456");

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getTransactionId()).isEqualTo("TXN123456");
        verify(paymentRepository, times(1)).findByTransactionId("TXN123456");
    }

    @Test
    @DisplayName("Should get payment status")
    void testGetPaymentStatus() {
        // Given
        when(paymentRepository.findByTransactionId("TXN123456"))
                .thenReturn(Optional.of(testPayment));

        // When
        Payment.PaymentStatus status = paymentService.getPaymentStatus("TXN123456");

        // Then
        assertThat(status).isEqualTo(Payment.PaymentStatus.PENDING);
        verify(paymentRepository, times(1)).findByTransactionId("TXN123456");
    }

    @Test
    @DisplayName("Should throw exception when payment not found")
    void testGetPaymentStatusNotFound() {
        // Given
        when(paymentRepository.findByTransactionId(anyString()))
                .thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> paymentService.getPaymentStatus("INVALID_TXN"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Payment not found");
    }
}


