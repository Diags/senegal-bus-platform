package com.bus.senegal.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bus.senegal.dto.BookingRequest;
import com.bus.senegal.dto.BookingResponse;
import com.bus.senegal.exception.BookingException;
import com.bus.senegal.exception.ResourceNotFoundException;
import com.bus.senegal.model.Booking;
import com.bus.senegal.model.Seat;
import com.bus.senegal.model.Trip;
import com.bus.senegal.model.User;
import com.bus.senegal.repository.BookingRepository;
import com.bus.senegal.repository.SeatRepository;
import com.bus.senegal.repository.TripRepository;
import com.bus.senegal.repository.UserRepository;
import com.bus.senegal.security.SecurityUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingService {
    
    private final BookingRepository bookingRepository;
    private final TripRepository tripRepository;
    private final SeatRepository seatRepository;
    private final UserRepository userRepository;
    
    @Transactional
    public BookingResponse createBooking(BookingRequest request) {
        log.info("Creating booking for trip: {}", request.getTripId());
        
        // Get current user
        // TODO: Re-enable auth in production
        String keycloakId = SecurityUtils.getCurrentUserKeycloakId()
                .orElse("test-user-123"); // Default user for testing
        
        User user = userRepository.findByKeycloakId(keycloakId)
                .orElse(userRepository.findById(1L)
                        .orElseThrow(() -> new ResourceNotFoundException("User not found")));
        
        // Validate trip
        Trip trip = tripRepository.findById(request.getTripId())
                .orElseThrow(() -> new ResourceNotFoundException("Trip", request.getTripId()));
        
        if (trip.getStatus() != Trip.TripStatus.SCHEDULED) {
            throw new BookingException("Trip is not available for booking");
        }
        
        // Get or auto-select seat
        Seat seat;
        if (request.getSeatId() != null) {
            // Siège spécifique demandé
            seat = seatRepository.findById(request.getSeatId())
                    .orElseThrow(() -> new ResourceNotFoundException("Seat", request.getSeatId()));
            
            if (seat.getStatus() != Seat.SeatStatus.AVAILABLE) {
                throw new BookingException("Seat is not available");
            }
        } else {
            // Auto-sélection du premier siège disponible
            seat = seatRepository.findFirstAvailableSeatByTripId(trip.getId())
                    .orElseThrow(() -> new BookingException("No available seats for this trip"));
        }
        
        if (trip.getAvailableSeats() < request.getNumberOfSeats()) {
            throw new BookingException("Not enough available seats");
        }
        
        // Generate unique booking number
        String bookingNumber = generateBookingNumber();
        
        // Create booking
        Booking booking = Booking.builder()
                .user(user)
                .trip(trip)
                .seat(seat)
                .bookingNumber(bookingNumber)
                .numberOfSeats(request.getNumberOfSeats())
                .status(Booking.BookingStatus.PENDING)
                .build();
        
        // Update seat status
        seat.setStatus(Seat.SeatStatus.RESERVED);
        seatRepository.save(seat);
        
        // Update available seats
        trip.setAvailableSeats(trip.getAvailableSeats() - request.getNumberOfSeats());
        tripRepository.save(trip);
        
        Booking saved = bookingRepository.save(booking);
        log.info("Booking created: {}", bookingNumber);
        
        return mapToResponse(saved);
    }
    
    @Transactional(readOnly = true)
    public BookingResponse getBookingById(Long id) {
        log.debug("Fetching booking with ID: {}", id);
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", id));
        return mapToResponse(booking);
    }
    
    @Transactional(readOnly = true)
    public BookingResponse getBookingByNumber(String bookingNumber) {
        log.debug("Fetching booking with number: {}", bookingNumber);
        Booking booking = bookingRepository.findByBookingNumber(bookingNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + bookingNumber));
        return mapToResponse(booking);
    }
    
    @Transactional(readOnly = true)
    public List<BookingResponse> getUserBookings() {
        String keycloakId = SecurityUtils.getCurrentUserKeycloakId()
                .orElseThrow(() -> new BookingException("User not authenticated"));
        
        User user = userRepository.findByKeycloakId(keycloakId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        return bookingRepository.findUserBookingHistory(user.getId()).stream()
                .map(this::mapToResponse)
                .toList();
    }
    
    @Transactional
    public void confirmBooking(Long id) {
        log.info("Confirming booking: {}", id);
        
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", id));
        
        booking.setStatus(Booking.BookingStatus.CONFIRMED);
        
        // Update seat status
        Seat seat = booking.getSeat();
        seat.setStatus(Seat.SeatStatus.OCCUPIED);
        seatRepository.save(seat);
        
        bookingRepository.save(booking);
        log.info("Booking confirmed: {}", id);
    }
    
    @Transactional
    public void cancelBooking(Long id) {
        log.warn("Cancelling booking: {}", id);
        
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", id));
        
        if (booking.getStatus() == Booking.BookingStatus.CONFIRMED) {
            throw new BookingException("Cannot cancel confirmed booking");
        }
        
        booking.setStatus(Booking.BookingStatus.CANCELLED);
        
        // Free the seat
        Seat seat = booking.getSeat();
        seat.setStatus(Seat.SeatStatus.AVAILABLE);
        seatRepository.save(seat);
        
        // Update available seats
        Trip trip = booking.getTrip();
        trip.setAvailableSeats(trip.getAvailableSeats() + booking.getNumberOfSeats());
        tripRepository.save(trip);
        
        bookingRepository.save(booking);
        log.info("Booking cancelled: {}", id);
    }
    
    private String generateBookingNumber() {
        return "BKG-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
    
    private BookingResponse mapToResponse(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .bookingNumber(booking.getBookingNumber())
                .userId(booking.getUser().getId())
                .userName(booking.getUser().getFirstName() + " " + booking.getUser().getLastName())
                .userEmail(booking.getUser().getEmail())
                .seatNumber(booking.getSeat().getSeatNumber())
                .numberOfSeats(booking.getNumberOfSeats())
                .status(booking.getStatus().name())
                .createdAt(booking.getCreatedAt())
                .updatedAt(booking.getUpdatedAt())
                .build();
    }
}

