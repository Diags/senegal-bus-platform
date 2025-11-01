package com.bus.senegal.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.bus.senegal.model.Seat;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {
    
    List<Seat> findByTripId(Long tripId);
    
    @Query("SELECT s FROM Seat s WHERE s.trip.id = :tripId AND s.status = 'AVAILABLE'")
    List<Seat> findAvailableSeatsByTripId(Long tripId);
    
    boolean existsByTripIdAndSeatNumber(Long tripId, String seatNumber);
}

