package com.bus.senegal.payment;

import com.bus.senegal.dto.PaymentRequest;
import com.bus.senegal.dto.PaymentResponse;

/**
 * Interface abstraite pour tous les providers de paiement
 */
public interface PaymentProvider {
    
    /**
     * Nom du provider (ORANGE_MONEY, WAVE, FREE_MONEY, PAYTECH)
     */
    String getProviderName();
    
    /**
     * Vérifie si le provider est disponible
     */
    boolean isAvailable();
    
    /**
     * Initie un paiement
     */
    PaymentResponse initiatePayment(PaymentRequest request);
    
    /**
     * Vérifie le statut d'un paiement
     */
    PaymentResponse checkPaymentStatus(String transactionId);
    
    /**
     * Traite un webhook callback
     */
    void handleWebhook(String payload);
    
    /**
     * Annule un paiement (si supporté)
     */
    PaymentResponse cancelPayment(String transactionId);
}

