package com.tcs.dhv.repository;

import com.tcs.dhv.domain.entity.Parcel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ParcelRepository extends JpaRepository<Parcel, UUID> {
    List<Parcel> findAllBySenderId(UUID userId);

    boolean existsByTrackingCode(String trackingCode);

    // For public tracking
    Optional<Parcel> findByTrackingCode(String trackingCode);
}
