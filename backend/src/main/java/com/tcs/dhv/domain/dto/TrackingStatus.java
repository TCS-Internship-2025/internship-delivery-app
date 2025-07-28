package com.tcs.dhv.domain.dto;

import java.time.LocalDateTime;

public record TrackingStatus(
        String status,
        LocalDateTime timestamp
) {
}
