package com.bus.senegal.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bus.senegal.dto.PaymentRequest;
import com.bus.senegal.dto.PaymentResponse;
import com.bus.senegal.exception.PaymentException;
import com.bus.senegal.exception.ResourceNotFoundException;
import com.bus.senegal.model.Booking;
import com.bus.senegal.model.Payment;
import com.bus.senegal.payment.PaymentProvider;
import com.bus.senegal.payment.PaymentProviderFactory;
import com.bus.senegal.repository.BookingRepository;
import com.bus.senegal.repository.PaymentRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {
    
    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final BookingService bookingService;
    private final PaymentProviderFactory providerFactory;
    
    @Transactional
    public PaymentResponse initiatePayment(PaymentRequest request) {
        log.info("Initiating payment for booking: {}", request.getBookingId());
        
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking", request.getBookingId()));
        
        if (booking.getStatus() != Booking.BookingStatus.PENDING) {
            throw new PaymentException("Booking is not in pending status");
        }
        
        // Check if payment already exists
        paymentRepository.findByBookingId(booking.getId())
                .ifPresent(p -> {
                    throw new PaymentException("Payment already exists for this booking");
                });
        
        // Calculate amount based on trip price and seats
        var amount = booking.getTrip().getPrice()
                .multiply(java.math.BigDecimal.valueOf(booking.getNumberOfSeats()));
        
        // Get the appropriate payment provider
        PaymentProvider provider = providerFactory.getProviderByMethod(request.getPaymentMethod());
        
        if (provider == null || !provider.isAvailable()) {
            // Fallback to PayTech with auto-retry
            provider = providerFactory.getDefaultProvider();
            log.warn("Requested provider not available, using default: {}", provider.getProviderName());
        }
        
        // Initiate payment through provider
        try {
            PaymentResponse providerResponse = provider.initiatePayment(request);
            log.info("Payment initiated successfully with provider: {}", provider.getProviderName());
            return providerResponse;
            
        } catch (PaymentException e) {
            log.error("Payment initiation failed: {}", e.getMessage());
            
            // Retry with default provider if different
            if (!provider.getProviderName().equals("PAYTECH")) {
                log.info("Retrying with PayTech fallback");
                PaymentProvider fallbackProvider = providerFactory.getDefaultProvider();
                return fallbackProvider.initiatePayment(request);
            }
            
            throw e;
        }
    }
    
    @Transactional
    public PaymentResponse processPaymentCallback(String transactionId, String status, String providerResponse) {
        log.info("Processing payment callback for transaction: {}", transactionId);
        
        Payment payment = paymentRepository.findByTransactionId(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found: " + transactionId));
        
        if ("success".equalsIgnoreCase(status)) {
            payment.setStatus(Payment.PaymentStatus.COMPLETED);
            payment.setPaidAt(LocalDateTime.now());
            payment.setPaymentProviderResponse(providerResponse);
            
            // Confirm the booking
            bookingService.confirmBooking(payment.getBooking().getId());
            
            log.info("Payment completed: {}", transactionId);
        } else {
            payment.setStatus(Payment.PaymentStatus.FAILED);
            payment.setPaymentProviderResponse(providerResponse);
            log.warn("Payment failed: {}", transactionId);
        }
        
        Payment updated = paymentRepository.save(payment);
        return mapToResponse(updated);
    }
    
    @Transactional(readOnly = true)
    public PaymentResponse getPaymentById(Long id) {
        log.debug("Fetching payment with ID: {}", id);
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", id));
        return mapToResponse(payment);
    }
    
    @Transactional(readOnly = true)
    public PaymentResponse getPaymentByBookingId(Long bookingId) {
        log.debug("Fetching payment for booking: {}", bookingId);
        Payment payment = paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for booking: " + bookingId));
        return mapToResponse(payment);
    }
    
    @Transactional(readOnly = true)
    public List<PaymentResponse> getPaymentsByStatus(Payment.PaymentStatus status) {
        log.debug("Fetching payments with status: {}", status);
        return paymentRepository.findByStatus(status).stream()
                .map(this::mapToResponse)
                .toList();
    }
    
    @Transactional
    public void refundPayment(Long id) {
        log.warn("Refunding payment: {}", id);
        
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", id));
        
        if (payment.getStatus() != Payment.PaymentStatus.COMPLETED) {
            throw new PaymentException("Can only refund completed payments");
        }
        
        payment.setStatus(Payment.PaymentStatus.REFUNDED);
        paymentRepository.save(payment);
        
        // Cancel the booking
        bookingService.cancelBooking(payment.getBooking().getId());
        
        log.info("Payment refunded: {}", id);
    }
    
    private String generateTransactionId() {
        return "TXN-" + UUID.randomUUID().toString().replace("-", "").substring(0, 16).toUpperCase();
    }
    
    private PaymentResponse mapToResponse(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .transactionId(payment.getTransactionId())
                .bookingId(payment.getBooking().getId())
                .bookingNumber(payment.getBooking().getBookingNumber())
                .paymentMethod(payment.getPaymentMethod().name())
                .amount(payment.getAmount())
                .status(payment.getStatus().name())
                .paidAt(payment.getPaidAt())
                .createdAt(payment.getCreatedAt())
                .build();
    }
}

