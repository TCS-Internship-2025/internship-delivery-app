package com.tcs.dhv.service;

import com.tcs.dhv.domain.dto.TrackingDto;
import com.tcs.dhv.domain.entity.Parcel;
import com.tcs.dhv.repository.ParcelRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@Service
public class TrackingService {

    private final ParcelRepository parcelRepository;

    @CacheEvict(value = "trackingDetails", key = "#trackingCode")
    public TrackingDto getTrackingDetails(String trackingCode){
         final var parcel = parcelRepository.findByTrackingCode(trackingCode)
                .orElseThrow(() -> new EntityNotFoundException("Parcel not found for tracking code: " + trackingCode));

        log.info("Getting tracking data of parcel with id : {}", parcel.getId());

        final var estimatedDevilryTime = calculateEstimatedDeliveryTime(parcel);

        return TrackingDto.builder()
                .parcelId(parcel.getId())
                .trackingCode(parcel.getTrackingCode())
                .senderName(parcel.getSender().getName())
                .recipientName(parcel.getRecipient().getName())
                .currentStatus(parcel.getCurrentStatus())
                .estimatedDelivery(estimatedDevilryTime)
                .build();
    }


    private Optional<LocalDateTime> calculateEstimatedDeliveryTime(Parcel parcel){

        return switch(parcel.getCurrentStatus()){
            case CREATED -> Optional.of(parcel.getCreatedAt().plusDays(7));
            case PICKED_UP -> Optional.of(parcel.getUpdatedAt().plusDays(5)); // the carier has it
            case IN_TRANSIT -> Optional.of(parcel.getUpdatedAt().plusDays(4));
            case OUT_FOR_DELIVERY -> Optional.of(parcel.getUpdatedAt().plusDays(2));
            case DELIVERY_ATTEMPTED -> Optional.of(parcel.getUpdatedAt().plusDays(1));// reattempt
            case DELIVERED,CANCELLED,RETURNED_TO_SENDER-> Optional.empty();
        };
    }

}
