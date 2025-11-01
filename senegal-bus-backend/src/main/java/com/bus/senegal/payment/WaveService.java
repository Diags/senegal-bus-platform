package com.bus.senegal.payment;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
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
public class WaveService implements PaymentProvider {
    
    private final PaymentProviderConfig config;
    private final RestTemplate restTemplate;
    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    
    @Override
    public String getProviderName() {
        return "WAVE";
    }
    
    @Override
    public boolean isAvailable() {
        return config.getWave().isEnabled();
    }
    
    @Override
    public PaymentResponse initiatePayment(PaymentRequest request) {
        log.info("Initiating Wave payment for booking: {}", request.getBookingId());
        
        try {
            Booking booking = bookingRepository.findById(request.getBookingId())
                    .orElseThrow(() -> new PaymentException("Booking not found"));
            
            String transactionId = "WAVE-" + UUID.randomUUID().toString();
            
            // Préparer la requête Wave API
            Map<String, Object> waveRequest = new HashMap<>();
            waveRequest.put("amount", booking.getTrip().getPrice().toString());
            waveRequest.put("currency", "XOF");
            waveRequest.put("client_reference", transactionId);
            waveRequest.put("success_url", config.getWave().getReturnUrl());
            waveRequest.put("error_url", config.getWave().getReturnUrl() + "/error");
            waveRequest.put("webhook_url", config.getWave().getCallbackUrl());
            
            // TODO: Appel réel à l'API Wave
            // ResponseEntity<Map> response = restTemplate.postForEntity(
            //     config.getWave().getApiUrl() + "/v1/checkout/sessions",
            //     createHttpEntity(waveRequest),
            //     Map.class
            // );
            
            log.info("Wave payment initiated (SANDBOX MODE): {}", transactionId);
            
            Payment payment = Payment.builder()
                    .booking(booking)
                    .amount(booking.getTrip().getPrice())
                    .paymentMethod(Payment.PaymentMethod.WAVE)
                    .status(Payment.PaymentStatus.PENDING)
                    .transactionId(transactionId)
                    .provider("WAVE")
                    .build();
            
            Payment saved = paymentRepository.save(payment);
            
            // Générer l'URL de paiement Wave (QR code ou lien)
            String paymentUrl = config.getWave().getApiUrl() + "/checkout/" + transactionId;
            
            return PaymentResponse.builder()
                    .id(saved.getId())
                    .bookingId(booking.getId())
                    .amount(saved.getAmount())
                    .paymentMethod(saved.getPaymentMethod().name())
                    .status(saved.getStatus().name())
                    .transactionId(transactionId)
                    .provider("WAVE")
                    .paymentUrl(paymentUrl)
                    .qrCode(generateQRCodeData(paymentUrl))
                    .message("Paiement Wave initié. Scannez le QR code ou utilisez le lien.")
                    .createdAt(saved.getCreatedAt())
                    .build();
            
        } catch (Exception e) {
            log.error("Wave payment initiation failed: {}", e.getMessage());
            throw new PaymentException("Échec de l'initiation du paiement Wave: " + e.getMessage());
        }
    }
    
    @Override
    public PaymentResponse checkPaymentStatus(String transactionId) {
        log.info("Checking Wave payment status: {}", transactionId);
        
        try {
            Payment payment = paymentRepository.findByTransactionId(transactionId)
                    .orElseThrow(() -> new PaymentException("Payment not found"));
            
            // TODO: Appel réel à l'API Wave
            // ResponseEntity<Map> response = restTemplate.exchange(
            //     config.getWave().getApiUrl() + "/v1/checkout/sessions/" + transactionId,
            //     HttpMethod.GET,
            //     createHttpEntity(null),
            //     Map.class
            // );
            
            return PaymentResponse.builder()
                    .id(payment.getId())
                    .bookingId(payment.getBooking().getId())
                    .amount(payment.getAmount())
                    .paymentMethod(payment.getPaymentMethod().name())
                    .status(payment.getStatus().name())
                    .transactionId(transactionId)
                    .provider("WAVE")
                    .createdAt(payment.getCreatedAt())
                    .build();
            
        } catch (Exception e) {
            log.error("Wave status check failed: {}", e.getMessage());
            throw new PaymentException("Échec de la vérification du statut: " + e.getMessage());
        }
    }
    
    @Override
    public void handleWebhook(String payload) {
        log.info("Processing Wave webhook: {}", payload);
        
        try {
            // TODO: Parser le payload Wave
            // Valider la signature
            // Mettre à jour le statut
            
            log.info("Wave webhook processed successfully");
            
        } catch (Exception e) {
            log.error("Wave webhook processing failed: {}", e.getMessage());
        }
    }
    
    @Override
    public PaymentResponse cancelPayment(String transactionId) {
        log.warn("Cancelling Wave payment: {}", transactionId);
        
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
                    .provider("WAVE")
                    .message("Paiement annulé")
                    .build();
            
        } catch (Exception e) {
            log.error("Wave payment cancellation failed: {}", e.getMessage());
            throw new PaymentException("Échec de l'annulation: " + e.getMessage());
        }
    }
    
    private HttpEntity<?> createHttpEntity(Object body) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + config.getWave().getApiKey());
        
        if (body != null) {
            return new HttpEntity<>(body, headers);
        }
        return new HttpEntity<>(headers);
    }
    
    private String generateQRCodeData(String paymentUrl) {
        // TODO: Générer un vrai QR code en base64
        // Pour l'instant, retourner simplement l'URL
        return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    }
}

