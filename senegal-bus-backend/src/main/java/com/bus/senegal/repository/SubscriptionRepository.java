package com.bus.senegal.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.bus.senegal.model.Subscription;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    
    Optional<Subscription> findByCompanyId(Long companyId);
    
    List<Subscription> findByCompanyIdOrderByStartDateDesc(Long companyId);
    
    List<Subscription> findByStatus(Subscription.SubscriptionStatus status);
    
    @Query("SELECT s FROM Subscription s WHERE s.company.id = :companyId AND s.status = 'ACTIVE' AND s.endDate >= CURRENT_DATE ORDER BY s.startDate DESC")
    Optional<Subscription> findActiveSubscriptionByCompanyId(@Param("companyId") Long companyId);
    
    @Query("SELECT s FROM Subscription s WHERE s.status = 'ACTIVE' AND s.endDate > :now AND s.endDate <= :sevenDaysFromNow")
    List<Subscription> findExpiringSubscriptions(@Param("now") LocalDateTime now, @Param("sevenDaysFromNow") LocalDateTime sevenDaysFromNow);
}

