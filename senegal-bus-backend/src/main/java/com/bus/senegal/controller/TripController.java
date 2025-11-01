package com.bus.senegal.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bus.senegal.dto.TripRequest;
import com.bus.senegal.dto.TripResponse;
import com.bus.senegal.dto.TripSearchRequest;
import com.bus.senegal.service.TripService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/trips")
@RequiredArgsConstructor
@Validated
@Slf4j
public class TripController {
    
    private final TripService tripService;
    
    @PostMapping
    @PreAuthorize("hasAnyRole('COMPAGNIE', 'ADMIN')")
    public ResponseEntity<TripResponse> createTrip(@Valid @RequestBody TripRequest request) {
        log.info("REST request to create trip");
        TripResponse response = tripService.createTrip(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @PostMapping("/search")
    public ResponseEntity<List<TripResponse>> searchTrips(@Valid @RequestBody TripSearchRequest request) {
        log.info("REST request to search trips: {} -> {}", 
                request.getDepartureCity(), request.getArrivalCity());
        List<TripResponse> trips = tripService.searchTrips(request);
        return ResponseEntity.ok(trips);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<TripResponse> getTrip(@PathVariable Long id) {
        log.info("REST request to get trip: {}", id);
        TripResponse response = tripService.getTripById(id);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/company/{companyId}")
    @PreAuthorize("hasAnyRole('COMPAGNIE', 'ADMIN')")
    public ResponseEntity<List<TripResponse>> getTripsByCompany(@PathVariable Long companyId) {
        log.info("REST request to get trips for company: {}", companyId);
        List<TripResponse> trips = tripService.getTripsByCompany(companyId);
        return ResponseEntity.ok(trips);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('COMPAGNIE', 'ADMIN')")
    public ResponseEntity<TripResponse> updateTrip(
            @PathVariable Long id,
            @Valid @RequestBody TripRequest request) {
        log.info("REST request to update trip: {}", id);
        TripResponse response = tripService.updateTrip(id, request);
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('COMPAGNIE', 'ADMIN')")
    public ResponseEntity<Void> cancelTrip(@PathVariable Long id) {
        log.info("REST request to cancel trip: {}", id);
        tripService.cancelTrip(id);
        return ResponseEntity.noContent().build();
    }
}

