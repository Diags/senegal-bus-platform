package com.bus.senegal.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bus.senegal.dto.SubscriptionRequest;
import com.bus.senegal.dto.SubscriptionResponse;
import com.bus.senegal.exception.ResourceNotFoundException;
import com.bus.senegal.exception.ValidationException;
import com.bus.senegal.model.Company;
import com.bus.senegal.model.Subscription;
import com.bus.senegal.repository.CompanyRepository;
import com.bus.senegal.repository.SubscriptionRepository;
import com.bus.senegal.repository.TripRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class SubscriptionService {
    
    private final SubscriptionRepository subscriptionRepository;
    private final CompanyRepository companyRepository;
    private final TripRepository tripRepository;
    
    @Transactional
    public SubscriptionResponse createSubscription(SubscriptionRequest request) {
        log.info("Creating subscription for company: {}", request.getCompanyId());
        
        Company company = companyRepository.findById(request.getCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("Company", request.getCompanyId()));
        
        // Check if company already has an active subscription
        subscriptionRepository.findActiveSubscriptionByCompanyId(company.getId())
                .ifPresent(sub -> {
                    throw new ValidationException("Company already has an active subscription");
                });
        
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime endDate = now.plusMonths(request.getDurationMonths());
        
        Subscription subscription = Subscription.builder()
                .company(company)
                .plan(request.getPlan())
                .monthlyPrice(request.getMonthlyPrice())
                .commissionPercentage(request.getCommissionPercentage())
                .startDate(now)
                .endDate(endDate)
                .status(Subscription.SubscriptionStatus.ACTIVE)
                .maxTripsPerMonth(request.getMaxTripsPerMonth())
                .maxBuses(request.getMaxBuses())
                .build();
        
        Subscription saved = subscriptionRepository.save(subscription);
        
        // Update company status
        company.setSubscriptionStatus(Company.SubscriptionStatus.ACTIVE);
        companyRepository.save(company);
        
        log.info("Subscription created for company: {}", company.getName());
        return mapToResponse(saved);
    }
    
    @Transactional(readOnly = true)
    public SubscriptionResponse getSubscriptionById(Long id) {
        log.debug("Fetching subscription: {}", id);
        Subscription subscription = subscriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription", id));
        return mapToResponse(subscription);
    }
    
    @Transactional(readOnly = true)
    public SubscriptionResponse getActiveSubscriptionByCompany(Long companyId) {
        log.debug("Fetching active subscription for company: {}", companyId);
        Subscription subscription = subscriptionRepository.findActiveSubscriptionByCompanyId(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("No active subscription for company: " + companyId));
        return mapToResponse(subscription);
    }
    
    @Transactional(readOnly = true)
    public List<SubscriptionResponse> getSubscriptionsByCompany(Long companyId) {
        log.debug("Fetching all subscriptions for company: {}", companyId);
        return subscriptionRepository.findByCompanyIdOrderByStartDateDesc(companyId).stream()
                .map(this::mapToResponse)
                .toList();
    }
    
    @Transactional
    public SubscriptionResponse renewSubscription(Long id, Integer durationMonths) {
        log.info("Renewing subscription: {}", id);
        
        Subscription subscription = subscriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription", id));
        
        if (subscription.getStatus() != Subscription.SubscriptionStatus.ACTIVE &&
            subscription.getStatus() != Subscription.SubscriptionStatus.EXPIRED) {
            throw new ValidationException("Can only renew active or expired subscriptions");
        }
        
        LocalDateTime newEndDate = LocalDateTime.now().plusMonths(durationMonths);
        subscription.setEndDate(newEndDate);
        subscription.setStatus(Subscription.SubscriptionStatus.ACTIVE);
        
        Subscription renewed = subscriptionRepository.save(subscription);
        log.info("Subscription renewed until: {}", newEndDate);
        
        return mapToResponse(renewed);
    }
    
    @Transactional
    public void cancelSubscription(Long id) {
        log.warn("Cancelling subscription: {}", id);
        
        Subscription subscription = subscriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription", id));
        
        subscription.setStatus(Subscription.SubscriptionStatus.CANCELLED);
        subscriptionRepository.save(subscription);
        
        // Update company status
        Company company = subscription.getCompany();
        company.setSubscriptionStatus(Company.SubscriptionStatus.CANCELLED);
        companyRepository.save(company);
        
        log.info("Subscription cancelled for company: {}", company.getName());
    }
    
    @Transactional(readOnly = true)
    public boolean checkSubscriptionLimits(Long companyId) {
        log.debug("Checking subscription limits for company: {}", companyId);
        
        Subscription subscription = subscriptionRepository.findActiveSubscriptionByCompanyId(companyId)
                .orElse(null);
        
        if (subscription == null) {
            return false;
        }
        
        // Check if subscription is expired
        if (subscription.getEndDate().isBefore(LocalDateTime.now())) {
            return false;
        }
        
        // Check trip limits if defined
        if (subscription.getMaxTripsPerMonth() != null) {
            LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0);
            LocalDateTime endOfMonth = startOfMonth.plusMonths(1);
            
            long tripCount = tripRepository.findByCompanyId(companyId).stream()
                    .filter(t -> t.getCreatedAt().isAfter(startOfMonth) && t.getCreatedAt().isBefore(endOfMonth))
                    .count();
            
            if (tripCount >= subscription.getMaxTripsPerMonth()) {
                log.warn("Company {} has reached trip limit", companyId);
                return false;
            }
        }
        
        return true;
    }
    
    private SubscriptionResponse mapToResponse(Subscription subscription) {
        return SubscriptionResponse.builder()
                .id(subscription.getId())
                .companyId(subscription.getCompany().getId())
                .companyName(subscription.getCompany().getName())
                .plan(subscription.getPlan().name())
                .monthlyPrice(subscription.getMonthlyPrice())
                .commissionPercentage(subscription.getCommissionPercentage())
                .startDate(subscription.getStartDate())
                .endDate(subscription.getEndDate())
                .status(subscription.getStatus().name())
                .maxTripsPerMonth(subscription.getMaxTripsPerMonth())
                .maxBuses(subscription.getMaxBuses())
                .createdAt(subscription.getCreatedAt())
                .updatedAt(subscription.getUpdatedAt())
                .build();
    }
}

