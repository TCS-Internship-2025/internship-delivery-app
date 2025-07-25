package com.tcs.dhv.repository;

import com.tcs.dhv.domain.entity.Parcel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ParcelRepository extends JpaRepository<Parcel, UUID> {
    Page<Parcel> findAllBySenderId(UUID userId, Pageable pageable);
    // For public tracking
    Optional<Parcel> findByTrackingCode(String trackingCode);
}
