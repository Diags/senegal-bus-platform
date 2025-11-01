package com.bus.senegal.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bus.senegal.model.Billing;
import com.bus.senegal.model.Booking;
import com.bus.senegal.model.Company;
import com.bus.senegal.model.Subscription;
import com.bus.senegal.repository.BillingRepository;
import com.bus.senegal.repository.BookingRepository;
import com.bus.senegal.repository.CompanyRepository;
import com.bus.senegal.repository.SubscriptionRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ScheduledTasksService {
    
    private final SubscriptionRepository subscriptionRepository;
    private final BillingRepository billingRepository;
    private final BookingRepository bookingRepository;
    private final CompanyRepository companyRepository;
    private final NotificationService notificationService;
    private final BillingService billingService;
    
    /**
     * Check for expiring subscriptions every day at 2 AM
     */
    @Scheduled(cron = "0 0 2 * * *")
    @Transactional
    public void checkExpiringSubscriptions() {
        log.info("Running scheduled task: checkExpiringSubscriptions");
        
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime sevenDaysFromNow = now.plusDays(7);
        
        List<Subscription> expiringSubscriptions = subscriptionRepository
                .findExpiringSubscriptions(now, sevenDaysFromNow);
        
        for (Subscription subscription : expiringSubscriptions) {
            log.warn("Subscription {} is expiring soon for company: {}", 
                    subscription.getId(), subscription.getCompany().getName());
            
            // TODO: Send notification to company admin about expiring subscription
            // notificationService.sendSubscriptionExpiryWarning(subscription);
        }
        
        log.info("Found {} expiring subscriptions", expiringSubscriptions.size());
    }
    
    /**
     * Process expired subscriptions every day at 3 AM
     */
    @Scheduled(cron = "0 0 3 * * *")
    @Transactional
    public void processExpiredSubscriptions() {
        log.info("Running scheduled task: processExpiredSubscriptions");
        
        LocalDateTime now = LocalDateTime.now();
        
        List<Subscription> activeSubscriptions = subscriptionRepository
                .findByStatus(Subscription.SubscriptionStatus.ACTIVE);
        
        int expiredCount = 0;
        for (Subscription subscription : activeSubscriptions) {
            if (subscription.getEndDate() != null && subscription.getEndDate().isBefore(now)) {
                log.warn("Expiring subscription {} for company: {}", 
                        subscription.getId(), subscription.getCompany().getName());
                
                subscription.setStatus(Subscription.SubscriptionStatus.EXPIRED);
                subscriptionRepository.save(subscription);
                
                // Update company status
                Company company = subscription.getCompany();
                company.setSubscriptionStatus(Company.SubscriptionStatus.EXPIRED);
                companyRepository.save(company);
                
                expiredCount++;
            }
        }
        
        log.info("Expired {} subscriptions", expiredCount);
    }
    
    /**
     * Generate monthly invoices on the 1st of each month at 1 AM
     */
    @Scheduled(cron = "0 0 1 1 * *")
    @Transactional
    public void generateMonthlyInvoices() {
        log.info("Running scheduled task: generateMonthlyInvoices");
        
        List<Subscription> activeSubscriptions = subscriptionRepository
                .findByStatus(Subscription.SubscriptionStatus.ACTIVE);
        
        int invoicesGenerated = 0;
        for (Subscription subscription : activeSubscriptions) {
            try {
                log.info("Generating invoice for company: {}", subscription.getCompany().getName());
                
                billingService.createBilling(
                        subscription.getCompany().getId(),
                        Billing.BillingType.SUBSCRIPTION,
                        subscription.getMonthlyPrice()
                );
                
                invoicesGenerated++;
                
            } catch (Exception e) {
                log.error("Failed to generate invoice for company {}: {}", 
                        subscription.getCompany().getName(), e.getMessage());
            }
        }
        
        log.info("Generated {} invoices", invoicesGenerated);
    }
    
    /**
     * Check for overdue payments every day at 4 AM
     */
    @Scheduled(cron = "0 0 4 * * *")
    @Transactional
    public void checkOverduePayments() {
        log.info("Running scheduled task: checkOverduePayments");
        
        LocalDateTime now = LocalDateTime.now();
        
        List<Billing> pendingBillings = billingRepository
                .findByStatus(Billing.BillingStatus.PENDING);
        
        int overdueCount = 0;
        for (Billing billing : pendingBillings) {
            if (billing.getDueDate() != null && billing.getDueDate().isBefore(now)) {
                log.warn("Payment overdue for billing: {} (Company: {})", 
                        billing.getInvoiceNumber(), billing.getCompany().getName());
                
                billingService.markAsOverdue(billing.getId());
                
                // TODO: Send overdue notification
                // notificationService.sendOverduePaymentNotification(billing);
                
                overdueCount++;
            }
        }
        
        log.info("Found {} overdue payments", overdueCount);
    }
    
    /**
     * Send trip reminders 24 hours before departure every hour
     */
    @Scheduled(cron = "0 0 * * * *")
    @Transactional
    public void sendTripReminders() {
        log.info("Running scheduled task: sendTripReminders");
        
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime tomorrow = now.plusHours(24);
        LocalDateTime tomorrowPlusOneHour = tomorrow.plusHours(1);
        
        List<Booking> upcomingBookings = bookingRepository.findAll().stream()
                .filter(b -> b.getStatus() == Booking.BookingStatus.CONFIRMED)
                .filter(b -> b.getTrip().getDepartureDateTime() != null)
                .filter(b -> b.getTrip().getDepartureDateTime().isAfter(tomorrow) && 
                           b.getTrip().getDepartureDateTime().isBefore(tomorrowPlusOneHour))
                .toList();
        
        int remindersSent = 0;
        for (Booking booking : upcomingBookings) {
            try {
                notificationService.sendTripReminder(booking);
                remindersSent++;
            } catch (Exception e) {
                log.error("Failed to send reminder for booking {}: {}", 
                        booking.getId(), e.getMessage());
            }
        }
        
        log.info("Sent {} trip reminders", remindersSent);
    }
    
    /**
     * Clean up old notifications every Sunday at 5 AM
     */
    @Scheduled(cron = "0 0 5 * * SUN")
    @Transactional
    public void cleanupOldNotifications() {
        log.info("Running scheduled task: cleanupOldNotifications");
        
        // TODO: Delete notifications older than 90 days
        // notificationRepository.deleteOlderThan(LocalDateTime.now().minusDays(90));
        
        log.info("Old notifications cleanup completed");
    }
}

