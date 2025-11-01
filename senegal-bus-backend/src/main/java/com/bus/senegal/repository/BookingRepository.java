package com.bus.senegal.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.bus.senegal.model.Booking;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    Optional<Booking> findByBookingNumber(String bookingNumber);
    
    List<Booking> findByUserId(Long userId);
    
    List<Booking> findByTripId(Long tripId);
    
    @Query("SELECT b FROM Booking b WHERE b.user.id = :userId ORDER BY b.createdAt DESC")
    List<Booking> findUserBookingHistory(Long userId);
    
    List<Booking> findByStatus(Booking.BookingStatus status);
}

