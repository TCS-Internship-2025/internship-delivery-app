package com.tcs.dhv.domain.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record TrackingRequest(
        @NotBlank
        @Pattern(regexp = "^HU\\d{10}[A-Z]{2}$", message = "Invalid tracking code format")
        String trackingCode
) {
}
