package com.tcs.dhv.service;

import com.tcs.dhv.domain.dto.TrackingRequest;
import com.tcs.dhv.domain.dto.TrackingResponse;
import com.tcs.dhv.domain.entity.Parcel;
import com.tcs.dhv.domain.entity.ParcelStatusHistory;
import com.tcs.dhv.mapper.TrackingMapper;
import com.tcs.dhv.repository.ParcelRepository;
import com.tcs.dhv.repository.ParcelStatusHistoryRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@Service
public class TrackingService {

    private final ParcelRepository parcelRepository;
    private final ParcelStatusHistoryRepository parcelStatusHistoryRepository;
    private final TrackingMapper trackingMapper;

    public TrackingResponse getTrackingDetails(TrackingRequest trackingRequest) {
        log.info("Getting tracking data of parcel with tracking code : {}", trackingRequest.trackingCode());

        Parcel parcel = parcelRepository.findByTrackingCode(trackingRequest.trackingCode())
                .orElseThrow(() -> new EntityNotFoundException("Parcel not found for tracking code: " + trackingRequest.trackingCode()));

        List<ParcelStatusHistory> statusHistory = parcelStatusHistoryRepository.findAllByParcelIdOrderByTimestampAsc(parcel.getId());
        Optional<LocalDateTime> estDeliveryDate = calculateEstimatedDevilryTime(parcel);

        return trackingMapper.toResponse(parcel, statusHistory)
                .toBuilder().estimatedDelivery(estDeliveryDate)
                .build();
    }

    private Optional<LocalDateTime> calculateEstimatedDevilryTime(Parcel parcel) {
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
