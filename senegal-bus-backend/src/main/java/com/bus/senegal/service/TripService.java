package com.bus.senegal.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bus.senegal.dto.TripRequest;
import com.bus.senegal.dto.TripResponse;
import com.bus.senegal.dto.TripSearchRequest;
import com.bus.senegal.exception.ResourceNotFoundException;
import com.bus.senegal.model.Bus;
import com.bus.senegal.model.Route;
import com.bus.senegal.model.Trip;
import com.bus.senegal.repository.BusRepository;
import com.bus.senegal.repository.RouteRepository;
import com.bus.senegal.repository.TripRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class TripService {
    
    private final TripRepository tripRepository;
    private final RouteRepository routeRepository;
    private final BusRepository busRepository;
    
    @Transactional
    public TripResponse createTrip(TripRequest request) {
        log.info("Creating new trip for route: {}", request.getRouteId());
        
        Route route = routeRepository.findById(request.getRouteId())
                .orElseThrow(() -> new ResourceNotFoundException("Route", request.getRouteId()));
        
        Bus bus = busRepository.findById(request.getBusId())
                .orElseThrow(() -> new ResourceNotFoundException("Bus", request.getBusId()));
        
        Trip trip = Trip.builder()
                .route(route)
                .bus(bus)
                .departureDateTime(request.getDepartureDateTime())
                .arrivalDateTime(request.getArrivalDateTime())
                .price(request.getPrice())
                .availableSeats(bus.getTotalSeats())
                .status(Trip.TripStatus.SCHEDULED)
                .build();
        
        Trip saved = tripRepository.save(trip);
        log.info("Trip created with ID: {}", saved.getId());
        
        return mapToResponse(saved);
    }
    
    @Transactional(readOnly = true)
    public List<TripResponse> searchTrips(TripSearchRequest searchRequest) {
        log.info("Searching trips: {} -> {}", 
                searchRequest.getDepartureCity(), 
                searchRequest.getArrivalCity());
        
        LocalDateTime startOfDay = searchRequest.getDepartureDate().atStartOfDay();
        LocalDateTime endOfDay = searchRequest.getDepartureDate().plusDays(1).atStartOfDay();
        
        List<Trip> trips = tripRepository.findAvailableTrips(
                searchRequest.getDepartureCity(),
                searchRequest.getArrivalCity(),
                startOfDay
        );
        
        return trips.stream()
                .filter(trip -> trip.getDepartureDateTime().isBefore(endOfDay))
                .filter(trip -> trip.getAvailableSeats() >= searchRequest.getPassengers())
                .map(this::mapToResponse)
                .toList();
    }
    
    @Transactional(readOnly = true)
    public TripResponse getTripById(Long id) {
        log.debug("Fetching trip with ID: {}", id);
        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trip", id));
        return mapToResponse(trip);
    }
    
    @Transactional(readOnly = true)
    public List<TripResponse> getTripsByCompany(Long companyId) {
        log.debug("Fetching trips for company: {}", companyId);
        return tripRepository.findByCompanyId(companyId).stream()
                .map(this::mapToResponse)
                .toList();
    }
    
    @Transactional
    public TripResponse updateTrip(Long id, TripRequest request) {
        log.info("Updating trip with ID: {}", id);
        
        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trip", id));
        
        Route route = routeRepository.findById(request.getRouteId())
                .orElseThrow(() -> new ResourceNotFoundException("Route", request.getRouteId()));
        
        Bus bus = busRepository.findById(request.getBusId())
                .orElseThrow(() -> new ResourceNotFoundException("Bus", request.getBusId()));
        
        trip.setRoute(route);
        trip.setBus(bus);
        trip.setDepartureDateTime(request.getDepartureDateTime());
        trip.setArrivalDateTime(request.getArrivalDateTime());
        trip.setPrice(request.getPrice());
        
        Trip updated = tripRepository.save(trip);
        log.info("Trip updated: {}", id);
        
        return mapToResponse(updated);
    }
    
    @Transactional
    public void cancelTrip(Long id) {
        log.warn("Cancelling trip with ID: {}", id);
        
        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trip", id));
        
        trip.setStatus(Trip.TripStatus.CANCELLED);
        tripRepository.save(trip);
        
        log.info("Trip cancelled: {}", id);
    }
    
    private TripResponse mapToResponse(Trip trip) {
        return TripResponse.builder()
                .id(trip.getId())
                .routeId(trip.getRoute().getId())
                .departureCity(trip.getRoute().getDepartureCity())
                .arrivalCity(trip.getRoute().getArrivalCity())
                .busId(trip.getBus().getId())
                .busBrand(trip.getBus().getBrand())
                .busModel(trip.getBus().getModel())
                .totalSeats(trip.getBus().getTotalSeats())
                .hasWifi(trip.getBus().getHasWifi())
                .hasAC(trip.getBus().getHasAC())
                .hasToilet(trip.getBus().getHasToilet())
                .companyName(trip.getBus().getCompany().getName())
                .companyLogoUrl(trip.getBus().getCompany().getLogoUrl())
                .departureDateTime(trip.getDepartureDateTime())
                .arrivalDateTime(trip.getArrivalDateTime())
                .price(trip.getPrice())
                .availableSeats(trip.getAvailableSeats())
                .status(trip.getStatus().name())
                .build();
    }
}

