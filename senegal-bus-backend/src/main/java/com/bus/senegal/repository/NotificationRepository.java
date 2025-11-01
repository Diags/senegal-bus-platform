package com.bus.senegal.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.bus.senegal.model.Notification;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    List<Notification> findByUserId(Long userId);
    
    List<Notification> findByBookingId(Long bookingId);
    
    List<Notification> findByStatus(Notification.NotificationStatus status);
    
    List<Notification> findByType(Notification.NotificationType type);
    
    @Query("SELECT n FROM Notification n WHERE n.recipient = :recipient ORDER BY n.createdAt DESC")
    List<Notification> findByRecipient(String recipient);
}

