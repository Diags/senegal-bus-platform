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

import com.bus.senegal.dto.BookingRequest;
import com.bus.senegal.dto.BookingResponse;
import com.bus.senegal.service.BookingService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
@Validated
@Slf4j
public class BookingController {
    
    private final BookingService bookingService;
    
    @PostMapping
    @PreAuthorize("hasAnyRole('CLIENT', 'ADMIN')")
    public ResponseEntity<BookingResponse> createBooking(@Valid @RequestBody BookingRequest request) {
        log.info("REST request to create booking");
        BookingResponse response = bookingService.createBooking(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('CLIENT', 'ADMIN')")
    public ResponseEntity<BookingResponse> getBooking(@PathVariable Long id) {
        log.info("REST request to get booking: {}", id);
        BookingResponse response = bookingService.getBookingById(id);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/number/{bookingNumber}")
    @PreAuthorize("hasAnyRole('CLIENT', 'ADMIN')")
    public ResponseEntity<BookingResponse> getBookingByNumber(@PathVariable String bookingNumber) {
        log.info("REST request to get booking by number: {}", bookingNumber);
        BookingResponse response = bookingService.getBookingByNumber(bookingNumber);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/my-bookings")
    @PreAuthorize("hasAnyRole('CLIENT', 'ADMIN')")
    public ResponseEntity<List<BookingResponse>> getMyBookings() {
        log.info("REST request to get user bookings");
        List<BookingResponse> bookings = bookingService.getUserBookings();
        return ResponseEntity.ok(bookings);
    }
    
    @PutMapping("/{id}/confirm")
    @PreAuthorize("hasAnyRole('COMPAGNIE', 'ADMIN')")
    public ResponseEntity<Void> confirmBooking(@PathVariable Long id) {
        log.info("REST request to confirm booking: {}", id);
        bookingService.confirmBooking(id);
        return ResponseEntity.noContent().build();
    }
    
    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('CLIENT', 'ADMIN')")
    public ResponseEntity<Void> cancelBooking(@PathVariable Long id) {
        log.info("REST request to cancel booking: {}", id);
        bookingService.cancelBooking(id);
        return ResponseEntity.noContent().build();
    }
}

