package com.bus.senegal.service;

import com.bus.senegal.dto.TripRequest;
import com.bus.senegal.dto.TripResponse;
import com.bus.senegal.dto.TripSearchRequest;
import com.bus.senegal.exception.ResourceNotFoundException;
import com.bus.senegal.model.Bus;
import com.bus.senegal.model.Company;
import com.bus.senegal.model.Route;
import com.bus.senegal.model.Trip;
import com.bus.senegal.repository.BusRepository;
import com.bus.senegal.repository.RouteRepository;
import com.bus.senegal.repository.TripRepository;
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
@DisplayName("TripService Unit Tests")
class TripServiceTest {

    @Mock
    private TripRepository tripRepository;

    @Mock
    private RouteRepository routeRepository;

    @Mock
    private BusRepository busRepository;

    @InjectMocks
    private TripService tripService;

    private Trip testTrip;
    private Route testRoute;
    private Bus testBus;
    private Company testCompany;

    @BeforeEach
    void setUp() {
        testCompany = Company.builder()
                .id(1L)
                .name("Test Company")
                .subscriptionStatus(Company.SubscriptionStatus.ACTIVE)
                .build();

        testRoute = Route.builder()
                .id(1L)
                .departureCity("Dakar")
                .arrivalCity("Saint-Louis")
                .distance(270.0)
                .estimatedDuration(240)
                .build();

        testBus = Bus.builder()
                .id(1L)
                .registrationNumber("DK-1234-AB")
                .brand("Mercedes")
                .model("Sprinter")
                .totalSeats(50)
                .company(testCompany)
                .build();

        testTrip = Trip.builder()
                .id(1L)
                .route(testRoute)
                .bus(testBus)
                .departureDateTime(LocalDateTime.now().plusDays(1))
                .arrivalDateTime(LocalDateTime.now().plusDays(1).plusHours(4))
                .price(15000.0)
                .status(Trip.TripStatus.SCHEDULED)
                .build();
    }

    @Test
    @DisplayName("Should create trip successfully")
    void testCreateTrip() {
        // Given
        TripRequest request = TripRequest.builder()
                .routeId(1L)
                .busId(1L)
                .departureDateTime(LocalDateTime.now().plusDays(1))
                .arrivalDateTime(LocalDateTime.now().plusDays(1).plusHours(4))
                .price(15000.0)
                .build();

        when(routeRepository.findById(1L)).thenReturn(Optional.of(testRoute));
        when(busRepository.findById(1L)).thenReturn(Optional.of(testBus));
        when(tripRepository.save(any(Trip.class))).thenReturn(testTrip);

        // When
        TripResponse response = tripService.createTrip(request);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getDepartureCity()).isEqualTo("Dakar");
        assertThat(response.getArrivalCity()).isEqualTo("Saint-Louis");
        assertThat(response.getPrice()).isEqualTo(15000.0);
        verify(tripRepository, times(1)).save(any(Trip.class));
    }

    @Test
    @DisplayName("Should search trips successfully")
    void testSearchTrips() {
        // Given
        TripSearchRequest searchRequest = TripSearchRequest.builder()
                .departureCity("Dakar")
                .arrivalCity("Saint-Louis")
                .departureDate("2025-11-01")
                .passengers(2)
                .build();

        List<Trip> trips = List.of(testTrip);
        when(tripRepository.searchTrips(anyString(), anyString(), any(LocalDateTime.class), any(LocalDateTime.class)))
                .thenReturn(trips);

        // When
        List<TripResponse> responses = tripService.searchTrips(searchRequest);

        // Then
        assertThat(responses).hasSize(1);
        assertThat(responses.get(0).getDepartureCity()).isEqualTo("Dakar");
        assertThat(responses.get(0).getArrivalCity()).isEqualTo("Saint-Louis");
        verify(tripRepository, times(1)).searchTrips(anyString(), anyString(), any(LocalDateTime.class), any(LocalDateTime.class));
    }

    @Test
    @DisplayName("Should get trip by ID successfully")
    void testGetTripById() {
        // Given
        when(tripRepository.findById(1L)).thenReturn(Optional.of(testTrip));

        // When
        TripResponse response = tripService.getTripById(1L);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1L);
        verify(tripRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Should throw exception when trip not found")
    void testGetTripByIdNotFound() {
        // Given
        when(tripRepository.findById(anyLong())).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> tripService.getTripById(999L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Trip not found");
    }

    @Test
    @DisplayName("Should check trip availability")
    void testCheckTripAvailability() {
        // Given
        when(tripRepository.findById(1L)).thenReturn(Optional.of(testTrip));

        // When
        boolean isAvailable = tripService.checkAvailability(1L, 5);

        // Then
        assertThat(isAvailable).isTrue();
        verify(tripRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Should return false when trip is full")
    void testCheckTripAvailabilityWhenFull() {
        // Given
        testTrip.setAvailableSeats(0);
        when(tripRepository.findById(1L)).thenReturn(Optional.of(testTrip));

        // When
        boolean isAvailable = tripService.checkAvailability(1L, 1);

        // Then
        assertThat(isAvailable).isFalse();
        verify(tripRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Should get trips by company ID")
    void testGetTripsByCompanyId() {
        // Given
        List<Trip> trips = List.of(testTrip);
        when(tripRepository.findByBusCompanyId(1L)).thenReturn(trips);

        // When
        List<TripResponse> responses = tripService.getTripsByCompanyId(1L);

        // Then
        assertThat(responses).hasSize(1);
        verify(tripRepository, times(1)).findByBusCompanyId(1L);
    }

    @Test
    @DisplayName("Should update trip status")
    void testUpdateTripStatus() {
        // Given
        when(tripRepository.findById(1L)).thenReturn(Optional.of(testTrip));
        when(tripRepository.save(any(Trip.class))).thenReturn(testTrip);

        // When
        tripService.updateTripStatus(1L, Trip.TripStatus.IN_TRANSIT);

        // Then
        verify(tripRepository, times(1)).findById(1L);
        verify(tripRepository, times(1)).save(any(Trip.class));
    }
}


