package com.tcs.dhv.service;

import com.tcs.dhv.domain.dto.ParcelDto;
import com.tcs.dhv.domain.dto.StatusUpdateDto;
import com.tcs.dhv.domain.entity.Parcel;
import com.tcs.dhv.domain.enums.ParcelStatus;
import com.tcs.dhv.domain.event.ParcelStatusUpdatedEvent;
import com.tcs.dhv.repository.ParcelRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CachePut;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@Service
public class ParcelCacheService {

    private final ParcelRepository parcelRepository;
    private final ParcelStatusHistoryService parcelStatusHistoryService;
    private final ApplicationEventPublisher applicationEventPublisher;
    static final Map<ParcelStatus, Set<ParcelStatus>> STATUS_TRANSITIONS = Map.of(
        ParcelStatus.CREATED, Set.of(ParcelStatus.PICKED_UP),
        ParcelStatus.PICKED_UP, Set.of(ParcelStatus.IN_TRANSIT),
        ParcelStatus.IN_TRANSIT, Set.of(ParcelStatus.OUT_FOR_DELIVERY, ParcelStatus.RETURNED_TO_SENDER),
        ParcelStatus.OUT_FOR_DELIVERY, Set.of(ParcelStatus.DELIVERED, ParcelStatus.DELIVERY_ATTEMPTED),
        ParcelStatus.DELIVERY_ATTEMPTED, Set.of(ParcelStatus.PICKED_UP,ParcelStatus.RETURNED_TO_SENDER),
        ParcelStatus.RETURNED_TO_SENDER, Set.of(),
        ParcelStatus.DELIVERED, Set.of(),
        ParcelStatus.CANCELLED, Set.of()
    );

    @Transactional
    @CachePut(value = "parcels", key = "#userId.toString().concat('-').concat(#parcelId.toString())", unless = "#result == null")
    public ParcelDto updateStatusAndCache(UUID parcelId, UUID userId, final Parcel parcel, final StatusUpdateDto statusDto) {
        if (!isValidStatusFlow(parcel, statusDto)) {
            throw new IllegalArgumentException("Invalid status change from " + parcel.getCurrentStatus() + " to " + statusDto.status());
        }

        log.info("Parcel status allowed to update");

        final var updatedRows = parcelRepository.updateStatusByTrackingCode(parcel.getTrackingCode(), statusDto.status());
        if (updatedRows == 0) {
            throw new EntityNotFoundException("Parcel not found with tracking code: " + parcel.getTrackingCode());
        }
        log.info("Parcel status updated to {} for tracking code: {}", statusDto.status(), parcel.getTrackingCode());

        parcel.setCurrentStatus(statusDto.status());

        parcelStatusHistoryService.addStatusHistory(parcel.getId(), "Parcel Status Changed to : " + statusDto.status());
        log.info("A new parcel status history added for id {}, new status {}", parcel.getId(), parcel.getCurrentStatus());

        applicationEventPublisher.publishEvent(new ParcelStatusUpdatedEvent(parcel));

        return ParcelDto.fromEntity(parcel);
    }

    private boolean isValidStatusFlow(final Parcel parcel, final StatusUpdateDto statusDto){
        final var allowedStatus = STATUS_TRANSITIONS.get(parcel.getCurrentStatus());
        return allowedStatus.contains(statusDto.status());
    }
}
