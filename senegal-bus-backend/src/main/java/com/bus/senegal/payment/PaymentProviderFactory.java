package com.bus.senegal.payment;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Component;

import com.bus.senegal.model.Payment.PaymentMethod;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class PaymentProviderFactory {
    
    private final Map<String, PaymentProvider> providers = new HashMap<>();
    
    public PaymentProviderFactory(List<PaymentProvider> providerList) {
        // Enregistrer tous les providers
        for (PaymentProvider provider : providerList) {
            String key = provider.getProviderName().toUpperCase();
            providers.put(key, provider);
            log.info("Registered payment provider: {}", key);
        }
    }
    
    /**
     * Récupère un provider par son nom
     */
    public PaymentProvider getProvider(String providerName) {
        if (providerName == null || providerName.isEmpty()) {
            log.warn("No provider specified, using default PayTech");
            return getDefaultProvider();
        }
        
        String key = providerName.toUpperCase();
        PaymentProvider provider = providers.get(key);
        
        if (provider == null) {
            log.warn("Unknown provider: {}, using default PayTech", providerName);
            return getDefaultProvider();
        }
        
        if (!provider.isAvailable()) {
            log.warn("Provider {} not available, using default PayTech", providerName);
            return getDefaultProvider();
        }
        
        return provider;
    }
    
    /**
     * Récupère un provider basé sur PaymentMethod
     */
    public PaymentProvider getProviderByMethod(PaymentMethod method) {
        switch (method) {
            case ORANGE_MONEY:
                return providers.getOrDefault("ORANGE_MONEY", getDefaultProvider());
            case WAVE:
                return providers.getOrDefault("WAVE", getDefaultProvider());
            case FREE_MONEY:
                return providers.getOrDefault("FREE_MONEY", getDefaultProvider());
            default:
                log.warn("Unknown payment method: {}, using default PayTech", method);
                return getDefaultProvider();
        }
    }
    
    /**
     * Retourne le provider par défaut (PayTech avec fallback)
     */
    public PaymentProvider getDefaultProvider() {
        return providers.getOrDefault("PAYTECH", null);
    }
    
    /**
     * Liste tous les providers disponibles
     */
    public List<PaymentProvider> getAvailableProviders() {
        return providers.values().stream()
                .filter(PaymentProvider::isAvailable)
                .toList();
    }
}

