package com.bus.senegal.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.bus.senegal.model.Company;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
    
    List<Company> findByNameContainingIgnoreCase(String name);
    
    @Query("SELECT c FROM Company c WHERE c.city = :city")
    List<Company> findByCity(String city);
}

