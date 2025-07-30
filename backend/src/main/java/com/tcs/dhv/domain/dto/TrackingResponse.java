package com.tcs.dhv.domain.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import lombok.Builder;

@Builder(toBuilder = true)
public record TrackingResponse(
        String trackingCode,
        String currentStatus,
        Optional<LocalDateTime> estimatedDelivery,
        List<TrackingStatus> timeline
) {
}
