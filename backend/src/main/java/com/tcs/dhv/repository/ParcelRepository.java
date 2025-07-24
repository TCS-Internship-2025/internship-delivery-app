package com.tcs.dhv.repository;

import com.tcs.dhv.entity.Parcel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ParcelRepository extends JpaRepository<Parcel, UUID> {
    Page<Parcel> findAllBySenderId(UUID userId, Pageable pageable);
    Optional<Parcel> findByTrackingCode(String trackingCode);
    boolean existsByTrackingCode(String trackingCode);
    long countBySenderId(UUID userId);
}
