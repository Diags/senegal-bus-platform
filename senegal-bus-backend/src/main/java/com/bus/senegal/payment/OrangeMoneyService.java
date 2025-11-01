package com.bus.senegal.payment;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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
public class OrangeMoneyService implements PaymentProvider {
    
    private final PaymentProviderConfig config;
    private final RestTemplate restTemplate;
    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    
    @Override
    public String getProviderName() {
        return "ORANGE_MONEY";
    }
    
    @Override
    public boolean isAvailable() {
        return config.getOrangeMoney().isEnabled();
    }
    
    @Override
    public PaymentResponse initiatePayment(PaymentRequest request) {
        log.info("Initiating Orange Money payment for booking: {}", request.getBookingId());
        
        try {
            Booking booking = bookingRepository.findById(request.getBookingId())
                    .orElseThrow(() -> new PaymentException("Booking not found"));
            
            // Génération de l'ID de transaction unique
            String transactionId = "OM-" + UUID.randomUUID().toString();
            
            // Préparer la requête pour Orange Money API
            Map<String, Object> orangeMoneyRequest = new HashMap<>();
            orangeMoneyRequest.put("merchant_code", config.getOrangeMoney().getMerchantCode());
            orangeMoneyRequest.put("merchant_key", config.getOrangeMoney().getMerchantKey());
            orangeMoneyRequest.put("amount", booking.getTrip().getPrice().toString());
            orangeMoneyRequest.put("currency", "XOF");
            orangeMoneyRequest.put("order_id", transactionId);
            orangeMoneyRequest.put("return_url", config.getOrangeMoney().getReturnUrl());
            orangeMoneyRequest.put("cancel_url", config.getOrangeMoney().getReturnUrl() + "/cancel");
            orangeMoneyRequest.put("notif_url", config.getOrangeMoney().getCallbackUrl());
            orangeMoneyRequest.put("lang", "fr");
            orangeMoneyRequest.put("reference", "BOOKING-" + booking.getId());
            
            // TODO: Appel réel à l'API Orange Money
            // ResponseEntity<Map> response = restTemplate.postForEntity(
            //     config.getOrangeMoney().getApiUrl() + "/webpayment/v1/orders",
            //     createHttpEntity(orangeMoneyRequest),
            //     Map.class
            // );
            
            // Pour l'instant, simulation de la réponse
            log.info("Orange Money payment initiated (SANDBOX MODE): {}", transactionId);
            
            // Créer l'enregistrement de paiement
            Payment payment = Payment.builder()
                    .booking(booking)
                    .amount(booking.getTrip().getPrice())
                    .paymentMethod(Payment.PaymentMethod.ORANGE_MONEY)
                    .status(Payment.PaymentStatus.PENDING)
                    .transactionId(transactionId)
                    .provider("ORANGE_MONEY")
                    .build();
            
            Payment saved = paymentRepository.save(payment);
            
            return PaymentResponse.builder()
                    .id(saved.getId())
                    .bookingId(booking.getId())
                    .amount(saved.getAmount())
                    .paymentMethod(saved.getPaymentMethod().name())
                    .status(saved.getStatus().name())
                    .transactionId(transactionId)
                    .provider("ORANGE_MONEY")
                    .paymentUrl(config.getOrangeMoney().getApiUrl() + "/payment/" + transactionId)
                    .message("Paiement Orange Money initié avec succès")
                    .createdAt(saved.getCreatedAt())
                    .build();
            
        } catch (Exception e) {
            log.error("Orange Money payment initiation failed: {}", e.getMessage());
            throw new PaymentException("Échec de l'initiation du paiement Orange Money: " + e.getMessage());
        }
    }
    
    @Override
    public PaymentResponse checkPaymentStatus(String transactionId) {
        log.info("Checking Orange Money payment status: {}", transactionId);
        
        try {
            Payment payment = paymentRepository.findByTransactionId(transactionId)
                    .orElseThrow(() -> new PaymentException("Payment not found"));
            
            // TODO: Appel réel à l'API Orange Money pour vérifier le statut
            // ResponseEntity<Map> response = restTemplate.exchange(
            //     config.getOrangeMoney().getApiUrl() + "/webpayment/v1/orders/" + transactionId,
            //     HttpMethod.GET,
            //     createHttpEntity(null),
            //     Map.class
            // );
            
            // Pour l'instant, retourner le statut actuel
            return PaymentResponse.builder()
                    .id(payment.getId())
                    .bookingId(payment.getBooking().getId())
                    .amount(payment.getAmount())
                    .paymentMethod(payment.getPaymentMethod().name())
                    .status(payment.getStatus().name())
                    .transactionId(transactionId)
                    .provider("ORANGE_MONEY")
                    .createdAt(payment.getCreatedAt())
                    .build();
            
        } catch (Exception e) {
            log.error("Orange Money status check failed: {}", e.getMessage());
            throw new PaymentException("Échec de la vérification du statut: " + e.getMessage());
        }
    }
    
    @Override
    public void handleWebhook(String payload) {
        log.info("Processing Orange Money webhook: {}", payload);
        
        try {
            // TODO: Parser le payload et extraire les informations
            // Valider la signature du webhook
            // Mettre à jour le statut du paiement
            
            log.info("Orange Money webhook processed successfully");
            
        } catch (Exception e) {
            log.error("Orange Money webhook processing failed: {}", e.getMessage());
        }
    }
    
    @Override
    public PaymentResponse cancelPayment(String transactionId) {
        log.warn("Cancelling Orange Money payment: {}", transactionId);
        
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
                    .provider("ORANGE_MONEY")
                    .message("Paiement annulé")
                    .build();
            
        } catch (Exception e) {
            log.error("Orange Money payment cancellation failed: {}", e.getMessage());
            throw new PaymentException("Échec de l'annulation: " + e.getMessage());
        }
    }
    
    private HttpEntity<?> createHttpEntity(Object body) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + config.getOrangeMoney().getApiKey());
        
        if (body != null) {
            return new HttpEntity<>(body, headers);
        }
        return new HttpEntity<>(headers);
    }
}

