package com.tcs.dhv.domain.dto;

import java.time.LocalDateTime;
import java.util.List;

public record TrackingResponse(
        String trackingCode,
        String currentStatus,
        LocalDateTime estimatedDelivery,
        List<TrackingStatus> timeline
) {
}
