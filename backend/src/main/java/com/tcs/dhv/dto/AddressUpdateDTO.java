package com.tcs.dhv.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record AddressUpdateDTO(
        @Size(max = 255, message = "Line 1 cannot exceed 255 characters")
        String line1,

        @Size(max = 255, message = "Line 2 cannot exceed 255 characters")
        String line2,

        @Size(max = 100, message = "Building cannot exceed 100 characters")
        String building,

        @Size(max = 50, message = "Apartment cannot exceed 50 characters")
        String apartment,

        @Size(max = 100, message = "City cannot exceed 100 characters")
        String city,

        @Pattern(regexp = "^\\d{4}$", message = "Hungarian postal code must be 4 digits")
        String postalCode,

        @Size(max = 100, message = "Country cannot exceed 100 characters")
        String country,

        // Source: https://www.latlong.net/place/budapest-hungary-23565.html
        // Ranges are an approximation
        @DecimalMin(value = "47.0", message = "Latitude must be between 47.0 and 48.0")
        @DecimalMax(value = "48.0", message = "Latitude must be between 47.0 and 48.0")
        Double latitude,

        @DecimalMin(value = "18.0", message = "Longitude must be between 18.0 and 20.0")
        @DecimalMax(value = "20.0", message = "Longitude must be between 18.0 and 20.0")
        Double longitude
) {}
