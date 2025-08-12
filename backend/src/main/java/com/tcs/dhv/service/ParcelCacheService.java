package com.tcs.dhv.service;

import com.tcs.dhv.domain.dto.StatusUpdateDto;
import com.tcs.dhv.domain.entity.Parcel;
import com.tcs.dhv.domain.enums.ParcelStatus;
import com.tcs.dhv.repository.ParcelRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CachePut;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@Service
public class ParcelCacheService {

    private final ParcelRepository parcelRepository;
    private final ParcelStatusHistoryService parcelStatusHistoryService;
    private final EmailService emailService;

    @Transactional
    @CachePut(value = "parcels", key = "#userId.toString().concat('-').concat(#parcelId.toString())")
    public void updateStatusAndCache(
        UUID parcelId,
        UUID userId,
        Parcel parcel,
        StatusUpdateDto statusDto
    ) {
        parcel.setCurrentStatus(statusDto.status());
        final var savedParcel = parcelRepository.saveAndFlush(parcel);

        final var description = "Parcel Status Changed to : " + statusDto.status();
        parcelStatusHistoryService.addStatusHistory(savedParcel.getId(), description);

        if (savedParcel.getCurrentStatus() == ParcelStatus.DELIVERED) {
            emailService.sendDeliveryCompleteEmail(
                savedParcel.getRecipient().getEmail(),
                savedParcel.getRecipient().getName(),
                savedParcel.getTrackingCode());
        } else {
            emailService.sendParcelStatusChangeNotification(
                savedParcel.getSender().getEmail(),
                savedParcel.getRecipient().getEmail(),
                savedParcel.getRecipient().getName(),
                savedParcel.getCurrentStatus(),
                savedParcel.getTrackingCode());
        }
    }
}
