package com.tcs.dhv.domain.dto;

import java.time.LocalDateTime;
import java.util.Optional;

import com.tcs.dhv.domain.enums.ParcelStatus;
import lombok.Builder;

@Builder
public record TrackingResponse(
        String trackingCode,
        String senderName,
        String recipientName,
        ParcelStatus currentStatus,
        Optional<LocalDateTime> estimatedDelivery
) {
}
