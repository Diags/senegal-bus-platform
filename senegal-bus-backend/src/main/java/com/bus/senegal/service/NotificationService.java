package com.bus.senegal.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bus.senegal.model.Booking;
import com.bus.senegal.model.Notification;
import com.bus.senegal.model.User;
import com.bus.senegal.repository.NotificationRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {
    
    private final NotificationRepository notificationRepository;
    
    @Transactional
    public void sendBookingConfirmation(Booking booking) {
        log.info("Sending booking confirmation for booking: {}", booking.getId());
        
        User user = booking.getUser();
        String message = buildBookingConfirmationMessage(booking);
        
        // Send SMS
        sendSMS(user, message);
        
        // Send Email
        sendEmail(user, "Confirmation de réservation", message);
        
        // Optionally send WhatsApp
        if (user.getPhoneNumber() != null && !user.getPhoneNumber().isEmpty()) {
            sendWhatsApp(user, message);
        }
    }
    
    @Transactional
    public void sendBookingCancellation(Booking booking) {
        log.info("Sending booking cancellation for booking: {}", booking.getId());
        
        User user = booking.getUser();
        String message = String.format(
                "Votre réservation #%d a été annulée. " +
                "Trajet: %s → %s. " +
                "Si vous avez des questions, contactez-nous.",
                booking.getId(),
                booking.getTrip().getRoute().getDepartureCity(),
                booking.getTrip().getRoute().getArrivalCity()
        );
        
        sendSMS(user, message);
        sendEmail(user, "Annulation de réservation", message);
    }
    
    @Transactional
    public void sendPaymentConfirmation(Booking booking) {
        log.info("Sending payment confirmation for booking: {}", booking.getId());
        
        User user = booking.getUser();
        String message = String.format(
                "Paiement confirmé pour votre réservation #%d. " +
                "Montant: %s XOF. " +
                "Trajet: %s → %s le %s. " +
                "Bon voyage!",
                booking.getId(),
                booking.getTrip().getPrice(),
                booking.getTrip().getRoute().getDepartureCity(),
                booking.getTrip().getRoute().getArrivalCity(),
                booking.getTrip().getDepartureDateTime().toLocalDate()
        );
        
        sendSMS(user, message);
        sendEmail(user, "Paiement confirmé", message);
    }
    
    @Transactional
    public void sendTripReminder(Booking booking) {
        log.info("Sending trip reminder for booking: {}", booking.getId());
        
        User user = booking.getUser();
        String message = String.format(
                "Rappel: Votre voyage est prévu demain! " +
                "Réservation #%d. " +
                "Trajet: %s → %s. " +
                "Départ: %s. " +
                "Présentez-vous 30 minutes avant le départ.",
                booking.getId(),
                booking.getTrip().getRoute().getDepartureCity(),
                booking.getTrip().getRoute().getArrivalCity(),
                booking.getTrip().getDepartureDateTime()
        );
        
        sendSMS(user, message);
        sendWhatsApp(user, message);
    }
    
    private void sendSMS(User user, String message) {
        try {
            log.info("Sending SMS to {}: {}", user.getPhoneNumber(), message);
            
            // TODO: Integrate with SMS provider (Twilio, OzinTel, etc.)
            // For now, just log and save to database
            
            Notification notification = Notification.builder()
                    .user(user)
                    .recipient(user.getPhoneNumber())
                    .type(Notification.NotificationType.SMS)
                    .message(message)
                    .status(Notification.NotificationStatus.SENT)
                    .sentAt(LocalDateTime.now())
                    .build();
            
            notificationRepository.save(notification);
            log.info("SMS notification saved for user: {}", user.getId());
            
        } catch (Exception e) {
            log.error("Failed to send SMS to {}: {}", user.getPhoneNumber(), e.getMessage());
            saveFailedNotification(user, Notification.NotificationType.SMS, message, e.getMessage());
        }
    }
    
    private void sendEmail(User user, String subject, String message) {
        try {
            log.info("Sending email to {}: {}", user.getEmail(), subject);
            
            // TODO: Integrate with email provider (SendGrid, Mailgun, etc.)
            // For now, just log and save to database
            
            Notification notification = Notification.builder()
                    .user(user)
                    .recipient(user.getEmail())
                    .type(Notification.NotificationType.EMAIL)
                    .message(String.format("Subject: %s\n\n%s", subject, message))
                    .status(Notification.NotificationStatus.SENT)
                    .sentAt(LocalDateTime.now())
                    .build();
            
            notificationRepository.save(notification);
            log.info("Email notification saved for user: {}", user.getId());
            
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", user.getEmail(), e.getMessage());
            saveFailedNotification(user, Notification.NotificationType.EMAIL, message, e.getMessage());
        }
    }
    
    private void sendWhatsApp(User user, String message) {
        try {
            log.info("Sending WhatsApp to {}: {}", user.getPhoneNumber(), message);
            
            // TODO: Integrate with WhatsApp Business API
            // For now, just log and save to database
            
            Notification notification = Notification.builder()
                    .user(user)
                    .recipient(user.getPhoneNumber())
                    .type(Notification.NotificationType.WHATSAPP)
                    .message(message)
                    .status(Notification.NotificationStatus.SENT)
                    .sentAt(LocalDateTime.now())
                    .build();
            
            notificationRepository.save(notification);
            log.info("WhatsApp notification saved for user: {}", user.getId());
            
        } catch (Exception e) {
            log.error("Failed to send WhatsApp to {}: {}", user.getPhoneNumber(), e.getMessage());
            saveFailedNotification(user, Notification.NotificationType.WHATSAPP, message, e.getMessage());
        }
    }
    
    private void saveFailedNotification(User user, Notification.NotificationType type, 
                                       String message, String errorMessage) {
        String recipient = type == Notification.NotificationType.EMAIL ? user.getEmail() : user.getPhoneNumber();
        
        Notification notification = Notification.builder()
                .user(user)
                .recipient(recipient)
                .type(type)
                .message(message)
                .status(Notification.NotificationStatus.FAILED)
                .errorMessage(errorMessage)
                .build();
        
        notificationRepository.save(notification);
        log.warn("Failed notification saved: {} for user: {}", type, user.getId());
    }
    
    private String buildBookingConfirmationMessage(Booking booking) {
        return String.format(
                "Confirmation de réservation #%d. " +
                "Trajet: %s → %s. " +
                "Date: %s. " +
                "Prix: %s XOF. " +
                "Code de réservation: %s",
                booking.getId(),
                booking.getTrip().getRoute().getDepartureCity(),
                booking.getTrip().getRoute().getArrivalCity(),
                booking.getTrip().getDepartureDateTime().toLocalDate(),
                booking.getTrip().getPrice(),
                booking.getBookingNumber()
        );
    }
}

