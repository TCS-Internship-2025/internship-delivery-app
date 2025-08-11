package com.tcs.dhv.domain.dto;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import com.tcs.dhv.domain.enums.ParcelStatus;
import lombok.Builder;

@Builder
public record TrackingDto(
    UUID parcelId,
    String trackingCode,
    String senderName,
    String recipientName,
    ParcelStatus currentStatus,
    Optional<LocalDateTime> estimatedDelivery
) implements Serializable {
}
