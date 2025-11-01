package com.bus.senegal.service;

import com.bus.senegal.dto.BookingRequest;
import com.bus.senegal.dto.BookingResponse;
import com.bus.senegal.exception.BookingException;
import com.bus.senegal.exception.ResourceNotFoundException;
import com.bus.senegal.model.*;
import com.bus.senegal.repository.BookingRepository;
import com.bus.senegal.repository.SeatRepository;
import com.bus.senegal.repository.TripRepository;
import com.bus.senegal.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("BookingService Unit Tests")
class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private TripRepository tripRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private SeatRepository seatRepository;

    @InjectMocks
    private BookingService bookingService;

    private Booking testBooking;
    private Trip testTrip;
    private User testUser;
    private Seat testSeat;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .email("user@test.com")
                .firstName("Test")
                .lastName("User")
                .phoneNumber("+221771234567")
                .build();

        Company testCompany = Company.builder()
                .id(1L)
                .name("Test Company")
                .build();

        Bus testBus = Bus.builder()
                .id(1L)
                .totalSeats(50)
                .company(testCompany)
                .build();

        Route testRoute = Route.builder()
                .id(1L)
                .departureCity("Dakar")
                .arrivalCity("Saint-Louis")
                .build();

        testTrip = Trip.builder()
                .id(1L)
                .route(testRoute)
                .bus(testBus)
                .departureDateTime(LocalDateTime.now().plusDays(1))
                .arrivalDateTime(LocalDateTime.now().plusDays(1).plusHours(4))
                .price(15000.0)
                .availableSeats(10)
                .status(Trip.TripStatus.SCHEDULED)
                .build();

        testSeat = Seat.builder()
                .id(1L)
                .bus(testBus)
                .seatNumber("A1")
                .seatType(Seat.SeatType.STANDARD)
                .build();

        testBooking = Booking.builder()
                .id(1L)
                .bookingNumber("BUS000001")
                .user(testUser)
                .trip(testTrip)
                .seat(testSeat)
                .numberOfSeats(2)
                .status(Booking.BookingStatus.PENDING)
                .build();
    }

    @Test
    @DisplayName("Should create booking successfully")
    void testCreateBooking() {
        // Given
        BookingRequest request = BookingRequest.builder()
                .tripId(1L)
                .seatId(1L)
                .numberOfSeats(2)
                .build();

        when(tripRepository.findById(1L)).thenReturn(Optional.of(testTrip));
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(testUser));
        when(seatRepository.findById(1L)).thenReturn(Optional.of(testSeat));
        when(bookingRepository.save(any(Booking.class))).thenReturn(testBooking);

        // When
        BookingResponse response = bookingService.createBooking(1L, request);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getBookingNumber()).isEqualTo("BUS000001");
        assertThat(response.getNumberOfSeats()).isEqualTo(2);
        verify(bookingRepository, times(1)).save(any(Booking.class));
    }

    @Test
    @DisplayName("Should throw exception when trip not found")
    void testCreateBookingTripNotFound() {
        // Given
        BookingRequest request = BookingRequest.builder()
                .tripId(999L)
                .seatId(1L)
                .numberOfSeats(2)
                .build();

        when(tripRepository.findById(999L)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> bookingService.createBooking(1L, request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Trip not found");
    }

    @Test
    @DisplayName("Should throw exception when not enough seats available")
    void testCreateBookingNotEnoughSeats() {
        // Given
        testTrip.setAvailableSeats(1);
        BookingRequest request = BookingRequest.builder()
                .tripId(1L)
                .seatId(1L)
                .numberOfSeats(2)
                .build();

        when(tripRepository.findById(1L)).thenReturn(Optional.of(testTrip));

        // When & Then
        assertThatThrownBy(() -> bookingService.createBooking(1L, request))
                .isInstanceOf(BookingException.class)
                .hasMessageContaining("Not enough seats available");
    }

    @Test
    @DisplayName("Should get booking by ID successfully")
    void testGetBookingById() {
        // Given
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(testBooking));

        // When
        BookingResponse response = bookingService.getBookingById(1L);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getBookingNumber()).isEqualTo("BUS000001");
        verify(bookingRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Should get user bookings successfully")
    void testGetUserBookings() {
        // Given
        List<Booking> bookings = List.of(testBooking);
        when(bookingRepository.findByUserId(1L)).thenReturn(bookings);

        // When
        List<BookingResponse> responses = bookingService.getUserBookings(1L);

        // Then
        assertThat(responses).hasSize(1);
        assertThat(responses.get(0).getBookingNumber()).isEqualTo("BUS000001");
        verify(bookingRepository, times(1)).findByUserId(1L);
    }

    @Test
    @DisplayName("Should cancel booking successfully")
    void testCancelBooking() {
        // Given
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(testBooking));
        when(bookingRepository.save(any(Booking.class))).thenReturn(testBooking);

        // When
        bookingService.cancelBooking(1L);

        // Then
        verify(bookingRepository, times(1)).findById(1L);
        verify(bookingRepository, times(1)).save(any(Booking.class));
    }

    @Test
    @DisplayName("Should confirm booking successfully")
    void testConfirmBooking() {
        // Given
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(testBooking));
        when(bookingRepository.save(any(Booking.class))).thenReturn(testBooking);

        // When
        bookingService.confirmBooking(1L);

        // Then
        verify(bookingRepository, times(1)).findById(1L);
        verify(bookingRepository, times(1)).save(any(Booking.class));
    }

    @Test
    @DisplayName("Should get bookings by status")
    void testGetBookingsByStatus() {
        // Given
        List<Booking> bookings = List.of(testBooking);
        when(bookingRepository.findByStatus(Booking.BookingStatus.PENDING))
                .thenReturn(bookings);

        // When
        List<BookingResponse> responses = bookingService.getBookingsByStatus(Booking.BookingStatus.PENDING);

        // Then
        assertThat(responses).hasSize(1);
        assertThat(responses.get(0).getStatus()).isEqualTo(Booking.BookingStatus.PENDING);
        verify(bookingRepository, times(1)).findByStatus(Booking.BookingStatus.PENDING);
    }

    @Test
    @DisplayName("Should generate unique booking number")
    void testGenerateBookingNumber() {
        // Given
        when(bookingRepository.count()).thenReturn(100L);

        // When
        String bookingNumber = bookingService.generateBookingNumber();

        // Then
        assertThat(bookingNumber).startsWith("BUS");
        assertThat(bookingNumber).hasSize(9); // BUS + 6 digits
    }
}


