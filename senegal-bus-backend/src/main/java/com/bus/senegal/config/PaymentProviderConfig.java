package com.bus.senegal.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "payment")
@Data
public class PaymentProviderConfig {
    
    private OrangeMoneyConfig orangeMoney = new OrangeMoneyConfig();
    private WaveConfig wave = new WaveConfig();
    private FreeMoneyConfig freeMoney = new FreeMoneyConfig();
    private PayTechConfig paytech = new PayTechConfig();
    
    @Data
    public static class OrangeMoneyConfig {
        private boolean enabled = true;
        private String apiUrl;
        private String merchantCode;
        private String merchantKey;
        private String apiKey;
        private String apiSecret;
        private String callbackUrl;
        private String returnUrl;
        private int timeoutSeconds = 30;
    }
    
    @Data
    public static class WaveConfig {
        private boolean enabled = true;
        private String apiUrl;
        private String apiKey;
        private String apiSecret;
        private String merchantId;
        private String callbackUrl;
        private String returnUrl;
        private int timeoutSeconds = 30;
    }
    
    @Data
    public static class FreeMoneyConfig {
        private boolean enabled = true;
        private String apiUrl;
        private String merchantId;
        private String apiKey;
        private String apiSecret;
        private String callbackUrl;
        private int timeoutSeconds = 30;
    }
    
    @Data
    public static class PayTechConfig {
        private boolean enabled = true;
        private String apiUrl;
        private String apiKey;
        private String apiSecret;
        private String merchantId;
        private String callbackUrl;
        private int timeoutSeconds = 30;
    }
}

