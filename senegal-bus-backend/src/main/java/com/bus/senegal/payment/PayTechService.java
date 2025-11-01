package com.bus.senegal.payment;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.bus.senegal.dto.PaymentRequest;
import com.bus.senegal.dto.PaymentResponse;
import com.bus.senegal.exception.PaymentException;
import com.bus.senegal.model.Payment.PaymentMethod;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class PayTechService implements PaymentProvider {
    
    private final OrangeMoneyService orangeMoneyService;
    private final WaveService waveService;
    private final FreeMoneyService freeMoneyService;
    
    @Override
    public String getProviderName() {
        return "PAYTECH";
    }
    
    @Override
    public boolean isAvailable() {
        return true; // Toujours disponible comme fallback
    }
    
    @Override
    public PaymentResponse initiatePayment(PaymentRequest request) {
        log.info("Initiating PayTech payment with fallback strategy for booking: {}", request.getBookingId());
        
        // Liste des providers à essayer dans l'ordre de préférence
        List<PaymentProvider> providers = List.of(
                orangeMoneyService,
                waveService,
                freeMoneyService
        );
        
        PaymentException lastException = null;
        
        // Essayer chaque provider jusqu'à ce qu'un fonctionne
        for (PaymentProvider provider : providers) {
            if (!provider.isAvailable()) {
                log.warn("Provider {} not available, trying next", provider.getProviderName());
                continue;
            }
            
            try {
                log.info("Attempting payment with provider: {}", provider.getProviderName());
                return provider.initiatePayment(request);
                
            } catch (PaymentException e) {
                log.error("Provider {} failed: {}", provider.getProviderName(), e.getMessage());
                lastException = e;
                // Continue to next provider
            }
        }
        
        // Tous les providers ont échoué
        log.error("All payment providers failed for booking: {}", request.getBookingId());
        throw new PaymentException("Tous les providers de paiement ont échoué. Dernière erreur: " + 
                (lastException != null ? lastException.getMessage() : "Inconnue"));
    }
    
    @Override
    public PaymentResponse checkPaymentStatus(String transactionId) {
        log.info("Checking PayTech payment status: {}", transactionId);
        
        // Déterminer le provider basé sur le préfixe de la transaction
        PaymentProvider provider = determineProviderFromTransactionId(transactionId);
        
        return provider.checkPaymentStatus(transactionId);
    }
    
    @Override
    public void handleWebhook(String payload) {
        log.info("Processing PayTech webhook: {}", payload);
        
        try {
            // TODO: Parser le payload pour identifier le provider source
            // Puis rediriger vers le bon provider
            
            // Tentative de déterminer le provider depuis le payload
            PaymentProvider provider = determineProviderFromWebhook(payload);
            provider.handleWebhook(payload);
            
        } catch (Exception e) {
            log.error("PayTech webhook processing failed: {}", e.getMessage());
        }
    }
    
    @Override
    public PaymentResponse cancelPayment(String transactionId) {
        log.warn("Cancelling PayTech payment: {}", transactionId);
        
        PaymentProvider provider = determineProviderFromTransactionId(transactionId);
        return provider.cancelPayment(transactionId);
    }
    
    /**
     * Détermine le provider à partir de l'ID de transaction
     */
    private PaymentProvider determineProviderFromTransactionId(String transactionId) {
        if (transactionId != null && transactionId.startsWith("OM-")) {
            return orangeMoneyService;
        } else if (transactionId != null && transactionId.startsWith("WAVE-")) {
            return waveService;
        } else if (transactionId != null && transactionId.startsWith("FREE-")) {
            return freeMoneyService;
        }
        
        // Par défaut, essayer Orange Money
        log.warn("Unknown transaction ID format: {}, defaulting to Orange Money", transactionId);
        return orangeMoneyService;
    }
    
    /**
     * Détermine le provider à partir du webhook payload
     */
    private PaymentProvider determineProviderFromWebhook(String payload) {
        // TODO: Implémenter la logique de détection basée sur le format du payload
        // Pour l'instant, retourner Orange Money par défaut
        return orangeMoneyService;
    }
}

