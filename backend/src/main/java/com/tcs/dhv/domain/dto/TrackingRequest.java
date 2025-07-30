package com.tcs.dhv.domain.dto;

import com.tcs.dhv.validation.TrackingCode;
import jakarta.validation.constraints.NotBlank;


public record TrackingRequest(
        @NotBlank(message = "Tracking code is required")
        @TrackingCode
        String trackingCode
) {
}
