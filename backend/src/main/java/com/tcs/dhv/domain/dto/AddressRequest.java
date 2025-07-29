package com.tcs.dhv.domain.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Schema(description = "Address request")
public record AddressRequest(
    @Schema(description = "Primary address line", example = "Kossuth street 12")
    @NotBlank(message = "Line 1 of the address is required")
    @Size(max = 255, message = "Line 1 cannot exceed 255 characters")
    String line1,

    @Schema(description = "Secondary address line", example = "2. floor")
    @Size(max = 255, message = "Line 2 cannot exceed 255 characters")
    String line2,

    @Schema(description = "Building number/characters", example = "3A")
    @Size(max = 100, message = "Building cannot exceed 100 characters")
    String building,

    @Schema(description = "Apartment number/characters", example = "12")
    @Size(max = 50, message = "Apartment cannot exceed 50 characters")
    String apartment,

    @Schema(description ="City", example = "Budapest")
    @NotBlank(message = "City is required")
    @Size(max = 100, message = "City cannot exceed 100 characters")
    String city,

    @Schema(description = "Postal Code", example = "1117")
    @NotBlank(message = "Postal code is required")
    @Pattern(regexp = "^\\d{4}$", message = "Hungarian postal code must be 4 digits")
    String postalCode,

    @Schema(description = "Country", example = "Hungary")
    @NotBlank(message = "Country is required")
    @Size(max = 100, message = "Country cannot exceed 100 characters")
    String country,

    // Source: https://www.latlong.net/place/budapest-hungary-23565.html
    // Ranges are an approximation
    @Schema(description = "Latitude of the location, between 47.0 and 48.0", example = "47.15")
    @DecimalMin(value = "47.0", message = "Latitude must be between 47.0 and 48.0")
    @DecimalMax(value = "48.0", message = "Latitude must be between 47.0 and 48.0")
    Double latitude,

    @Schema(description = "Longitude of the location, between 18.0 and 20.0", example = "18.746")
    @DecimalMin(value = "18.0", message = "Longitude must be between 18.0 and 20.0")
    @DecimalMax(value = "20.0", message = "Longitude must be between 18.0 and 20.0")
    Double longitude
) {
}
