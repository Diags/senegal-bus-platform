package com.bus.senegal.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.bus.senegal.model.Trip;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {
    
    List<Trip> findByRouteId(Long routeId);
    
    List<Trip> findByBusId(Long busId);
    
    @Query("SELECT t FROM Trip t WHERE t.route.departureCity = :departureCity " +
           "AND t.route.arrivalCity = :arrivalCity " +
           "AND t.departureDateTime >= :departureDate " +
           "AND t.status = 'SCHEDULED' " +
           "ORDER BY t.departureDateTime")
    List<Trip> findAvailableTrips(String departureCity, String arrivalCity, LocalDateTime departureDate);
    
    @Query("SELECT t FROM Trip t WHERE t.bus.company.id = :companyId")
    List<Trip> findByCompanyId(Long companyId);
    
    List<Trip> findByDepartureDateTimeBetween(LocalDateTime start, LocalDateTime end);
}

