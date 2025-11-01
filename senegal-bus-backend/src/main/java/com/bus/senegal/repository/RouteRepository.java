package com.bus.senegal.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.bus.senegal.model.Route;

@Repository
public interface RouteRepository extends JpaRepository<Route, Long> {
    
    @Query("SELECT r FROM Route r WHERE r.departureCity = :departureCity AND r.arrivalCity = :arrivalCity")
    Optional<Route> findByDepartureAndArrivalCities(String departureCity, String arrivalCity);
    
    @Query("SELECT r FROM Route r WHERE r.departureCity = :city OR r.arrivalCity = :city")
    List<Route> findByCity(String city);
    
    @Query("SELECT DISTINCT r.departureCity FROM Route r ORDER BY r.departureCity")
    List<String> findAllDepartureCities();
    
    @Query("SELECT DISTINCT r.arrivalCity FROM Route r ORDER BY r.arrivalCity")
    List<String> findAllArrivalCities();
}

