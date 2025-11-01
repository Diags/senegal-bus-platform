package com.bus.senegal.payment;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.bus.senegal.config.PaymentProviderConfig;
import com.bus.senegal.dto.PaymentRequest;
import com.bus.senegal.dto.PaymentResponse;
import com.bus.senegal.exception.PaymentException;
import com.bus.senegal.model.Booking;
import com.bus.senegal.model.Payment;
import com.bus.senegal.repository.BookingRepository;
import com.bus.senegal.repository.PaymentRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class FreeMoneyService implements PaymentProvider {
    
    private final PaymentProviderConfig config;
    private final RestTemplate restTemplate;
    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    
    @Override
    public String getProviderName() {
        return "FREE_MONEY";
    }
    
    @Override
    public boolean isAvailable() {
        return config.getFreeMoney().isEnabled();
    }
    
    @Override
    public PaymentResponse initiatePayment(PaymentRequest request) {
        log.info("Initiating Free Money payment for booking: {}", request.getBookingId());
        
        try {
            Booking booking = bookingRepository.findById(request.getBookingId())
                    .orElseThrow(() -> new PaymentException("Booking not found"));
            
            String transactionId = "FREE-" + UUID.randomUUID().toString();
            
            // Préparer la requête Free Money API
            Map<String, Object> freeMoneyRequest = new HashMap<>();
            freeMoneyRequest.put("merchant_id", config.getFreeMoney().getMerchantId());
            freeMoneyRequest.put("amount", booking.getTrip().getPrice().toString());
            freeMoneyRequest.put("currency", "XOF");
            freeMoneyRequest.put("order_id", transactionId);
            freeMoneyRequest.put("callback_url", config.getFreeMoney().getCallbackUrl());
            freeMoneyRequest.put("description", "Réservation Bus Sénégal #" + booking.getId());
            
            // TODO: Appel réel à l'API Free Money
            // ResponseEntity<Map> response = restTemplate.postForEntity(
            //     config.getFreeMoney().getApiUrl() + "/api/v1/payments",
            //     createHttpEntity(freeMoneyRequest),
            //     Map.class
            // );
            
            log.info("Free Money payment initiated (SANDBOX MODE): {}", transactionId);
            
            Payment payment = Payment.builder()
                    .booking(booking)
                    .amount(booking.getTrip().getPrice())
                    .paymentMethod(Payment.PaymentMethod.FREE_MONEY)
                    .status(Payment.PaymentStatus.PENDING)
                    .transactionId(transactionId)
                    .provider("FREE_MONEY")
                    .build();
            
            Payment saved = paymentRepository.save(payment);
            
            String paymentUrl = config.getFreeMoney().getApiUrl() + "/payment/" + transactionId;
            
            return PaymentResponse.builder()
                    .id(saved.getId())
                    .bookingId(booking.getId())
                    .amount(saved.getAmount())
                    .paymentMethod(saved.getPaymentMethod().name())
                    .status(saved.getStatus().name())
                    .transactionId(transactionId)
                    .provider("FREE_MONEY")
                    .paymentUrl(paymentUrl)
                    .message("Paiement Free Money initié. Complétez depuis votre app mobile.")
                    .createdAt(saved.getCreatedAt())
                    .build();
            
        } catch (Exception e) {
            log.error("Free Money payment initiation failed: {}", e.getMessage());
            throw new PaymentException("Échec de l'initiation du paiement Free Money: " + e.getMessage());
        }
    }
    
    @Override
    public PaymentResponse checkPaymentStatus(String transactionId) {
        log.info("Checking Free Money payment status: {}", transactionId);
        
        try {
            Payment payment = paymentRepository.findByTransactionId(transactionId)
                    .orElseThrow(() -> new PaymentException("Payment not found"));
            
            // TODO: Appel réel à l'API Free Money pour vérifier le statut
            return PaymentResponse.builder()
                    .id(payment.getId())
                    .bookingId(payment.getBooking().getId())
                    .amount(payment.getAmount())
                    .paymentMethod(payment.getPaymentMethod().name())
                    .status(payment.getStatus().name())
                    .transactionId(transactionId)
                    .provider("FREE_MONEY")
                    .createdAt(payment.getCreatedAt())
                    .build();
            
        } catch (Exception e) {
            log.error("Free Money status check failed: {}", e.getMessage());
            throw new PaymentException("Échec de la vérification du statut: " + e.getMessage());
        }
    }
    
    @Override
    public void handleWebhook(String payload) {
        log.info("Processing Free Money webhook: {}", payload);
        
        try {
            // TODO: Parser le payload Free Money
            // Valider la signature
            // Mettre à jour le statut
            
            log.info("Free Money webhook processed successfully");
            
        } catch (Exception e) {
            log.error("Free Money webhook processing failed: {}", e.getMessage());
        }
    }
    
    @Override
    public PaymentResponse cancelPayment(String transactionId) {
        log.warn("Cancelling Free Money payment: {}", transactionId);
        
        try {
            Payment payment = paymentRepository.findByTransactionId(transactionId)
                    .orElseThrow(() -> new PaymentException("Payment not found"));
            
            if (payment.getStatus() == Payment.PaymentStatus.COMPLETED) {
                throw new PaymentException("Cannot cancel completed payment");
            }
            
            payment.setStatus(Payment.PaymentStatus.CANCELLED);
            Payment updated = paymentRepository.save(payment);
            
            return PaymentResponse.builder()
                    .id(updated.getId())
                    .bookingId(updated.getBooking().getId())
                    .amount(updated.getAmount())
                    .paymentMethod(updated.getPaymentMethod().name())
                    .status(updated.getStatus().name())
                    .transactionId(transactionId)
                    .provider("FREE_MONEY")
                    .message("Paiement annulé")
                    .build();
            
        } catch (Exception e) {
            log.error("Free Money payment cancellation failed: {}", e.getMessage());
            throw new PaymentException("Échec de l'annulation: " + e.getMessage());
        }
    }
    
    private HttpEntity<?> createHttpEntity(Object body) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + config.getFreeMoney().getApiKey());
        
        if (body != null) {
            return new HttpEntity<>(body, headers);
        }
        return new HttpEntity<>(headers);
    }
}

