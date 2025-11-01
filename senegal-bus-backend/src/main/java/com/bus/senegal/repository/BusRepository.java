package com.bus.senegal.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.bus.senegal.model.Bus;

@Repository
public interface BusRepository extends JpaRepository<Bus, Long> {
    
    List<Bus> findByCompanyId(Long companyId);
    
    List<Bus> findByPlateNumberContainingIgnoreCase(String plateNumber);
    
    @Query("SELECT b FROM Bus b WHERE b.status = 'AVAILABLE'")
    List<Bus> findAvailableBuses();
    
    @Query("SELECT b FROM Bus b WHERE b.company.id = :companyId AND b.status = 'AVAILABLE'")
    List<Bus> findAvailableBusesByCompany(Long companyId);
}

