package com.bus.senegal.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bus.senegal.config.TenantContext;
import com.bus.senegal.dto.AnalyticsResponse;
import com.bus.senegal.model.Booking;
import com.bus.senegal.model.Company;
import com.bus.senegal.model.Payment;
import com.bus.senegal.model.Trip;
import com.bus.senegal.repository.BookingRepository;
import com.bus.senegal.repository.CompanyRepository;
import com.bus.senegal.repository.PaymentRepository;
import com.bus.senegal.repository.TripRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnalyticsService {
    
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final TripRepository tripRepository;
    private final CompanyRepository companyRepository;
    
    @Transactional(readOnly = true)
    public AnalyticsResponse getGlobalAnalytics() {
        log.info("Generating global analytics");
        
        List<Booking> allBookings = bookingRepository.findAll();
        List<Trip> allTrips = tripRepository.findAll();
        List<Company> allCompanies = companyRepository.findAll();
        List<Payment> allPayments = paymentRepository.findAll();
        
        return buildAnalyticsResponse(allBookings, allTrips, allCompanies, allPayments);
    }
    
    @Transactional(readOnly = true)
    public AnalyticsResponse getCompanyAnalytics(Long companyId) {
        log.info("Generating analytics for company: {}", companyId);
        
        // Filter bookings by company
        List<Booking> bookings = bookingRepository.findAll().stream()
                .filter(b -> b.getTrip() != null && b.getTrip().getBus() != null && 
                           b.getTrip().getBus().getCompany().getId().equals(companyId))
                .toList();
        List<Trip> trips = tripRepository.findByCompanyId(companyId);
        List<Payment> payments = paymentRepository.findAll().stream()
                .filter(p -> p.getBooking() != null && 
                           p.getBooking().getTrip() != null && 
                           p.getBooking().getTrip().getBus() != null &&
                           p.getBooking().getTrip().getBus().getCompany().getId().equals(companyId))
                .toList();
        
        return buildAnalyticsResponse(bookings, trips, List.of(), payments);
    }
    
    @Transactional(readOnly = true)
    public AnalyticsResponse getTenantAnalytics() {
        Long tenantId = TenantContext.getTenantId();
        if (tenantId == null) {
            log.warn("No tenant context found, returning empty analytics");
            return AnalyticsResponse.builder().build();
        }
        
        log.info("Generating analytics for tenant: {}", tenantId);
        return getCompanyAnalytics(tenantId);
    }
    
    private AnalyticsResponse buildAnalyticsResponse(
            List<Booking> bookings, 
            List<Trip> trips, 
            List<Company> companies,
            List<Payment> payments) {
        
        // Booking statistics
        long totalBookings = bookings.size();
        long completedBookings = bookings.stream()
                .filter(b -> b.getStatus() == Booking.BookingStatus.CONFIRMED)
                .count();
        long cancelledBookings = bookings.stream()
                .filter(b -> b.getStatus() == Booking.BookingStatus.CANCELLED)
                .count();
        long pendingBookings = bookings.stream()
                .filter(b -> b.getStatus() == Booking.BookingStatus.PENDING)
                .count();
        
        // Revenue statistics
        BigDecimal totalRevenue = payments.stream()
                .filter(p -> p.getStatus() == Payment.PaymentStatus.COMPLETED)
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0);
        BigDecimal monthlyRevenue = payments.stream()
                .filter(p -> p.getStatus() == Payment.PaymentStatus.COMPLETED)
                .filter(p -> p.getCreatedAt() != null && p.getCreatedAt().isAfter(startOfMonth))
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal averageBookingValue = totalBookings > 0 
                ? totalRevenue.divide(BigDecimal.valueOf(totalBookings), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;
        
        // Trip statistics
        long totalTrips = trips.size();
        long activeTrips = trips.stream()
                .filter(t -> t.getDepartureDateTime() != null && t.getDepartureDateTime().isAfter(LocalDateTime.now()))
                .count();
        long completedTrips = trips.stream()
                .filter(t -> t.getArrivalDateTime() != null && t.getArrivalDateTime().isBefore(LocalDateTime.now()))
                .count();
        
        // Company statistics
        long totalCompanies = companies.size();
        long activeCompanies = companies.stream()
                .filter(c -> c.getSubscriptionStatus() == Company.SubscriptionStatus.ACTIVE)
                .count();
        
        // Average occupancy rate
        double averageOccupancy = calculateAverageOccupancy(bookings, trips);
        
        // Top routes
        Map<String, Long> topRoutes = calculateTopRoutes(bookings);
        
        // Bookings trend (last 30 days)
        Map<String, Long> bookingsTrend = calculateBookingsTrend(bookings);
        
        return AnalyticsResponse.builder()
                .totalBookings(totalBookings)
                .completedBookings(completedBookings)
                .cancelledBookings(cancelledBookings)
                .pendingBookings(pendingBookings)
                .totalRevenue(totalRevenue)
                .monthlyRevenue(monthlyRevenue)
                .averageBookingValue(averageBookingValue)
                .totalTrips(totalTrips)
                .activeTrips(activeTrips)
                .completedTrips(completedTrips)
                .totalCompanies(totalCompanies)
                .activeCompanies(activeCompanies)
                .averageOccupancyRate(averageOccupancy)
                .topRoutes(topRoutes)
                .bookingsTrend(bookingsTrend)
                .build();
    }
    
    private double calculateAverageOccupancy(List<Booking> bookings, List<Trip> trips) {
        if (trips.isEmpty()) return 0.0;
        
        double totalOccupancy = 0.0;
        int validTrips = 0;
        
        for (Trip trip : trips) {
            if (trip.getBus() != null && trip.getBus().getTotalSeats() != null && trip.getBus().getTotalSeats() > 0) {
                long bookedSeats = bookings.stream()
                        .filter(b -> b.getTrip().getId().equals(trip.getId()))
                        .filter(b -> b.getStatus() != Booking.BookingStatus.CANCELLED)
                        .count();
                
                double occupancy = (double) bookedSeats / trip.getBus().getTotalSeats() * 100;
                totalOccupancy += occupancy;
                validTrips++;
            }
        }
        
        return validTrips > 0 ? totalOccupancy / validTrips : 0.0;
    }
    
    private Map<String, Long> calculateTopRoutes(List<Booking> bookings) {
        return bookings.stream()
                .filter(b -> b.getTrip() != null && b.getTrip().getRoute() != null)
                .collect(Collectors.groupingBy(
                        b -> b.getTrip().getRoute().getDepartureCity() + " → " + b.getTrip().getRoute().getArrivalCity(),
                        Collectors.counting()
                ))
                .entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(10)
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue,
                        (e1, e2) -> e1,
                        LinkedHashMap::new
                ));
    }
    
    private Map<String, Long> calculateBookingsTrend(List<Booking> bookings) {
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        
        return bookings.stream()
                .filter(b -> b.getCreatedAt() != null && b.getCreatedAt().isAfter(thirtyDaysAgo))
                .collect(Collectors.groupingBy(
                        b -> b.getCreatedAt().format(formatter),
                        Collectors.counting()
                ))
                .entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue,
                        (e1, e2) -> e1,
                        LinkedHashMap::new
                ));
    }
}

