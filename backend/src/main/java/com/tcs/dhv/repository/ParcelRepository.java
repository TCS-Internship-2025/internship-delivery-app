package com.tcs.dhv.repository;

import com.tcs.dhv.domain.entity.Parcel;
import com.tcs.dhv.domain.enums.ParcelStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

public interface ParcelRepository extends JpaRepository<Parcel, UUID> {

    @EntityGraph(attributePaths = {"sender", "sender.address", "recipient", "recipient.address"})
    List<Parcel> findAllBySenderId(UUID userId);

    @EntityGraph(attributePaths = {"sender", "sender.address", "recipient", "recipient.address"})
    boolean existsByTrackingCode(String trackingCode);

    @EntityGraph(attributePaths = {"sender", "sender.address", "recipient", "recipient.address"})
    Optional<Parcel> findByTrackingCode(String trackingCode);

    boolean existsBySenderIdAndCurrentStatusIn(UUID senderId, Set<ParcelStatus> status);
    boolean existsByRecipientIdAndCurrentStatusIn(UUID recipientId, Set<ParcelStatus> status);
}
