package com.tcs.dhv.dto;

import jakarta.validation.constraints.NotBlank;

public record AddressDto(
        @NotBlank(message = "Address name is required")
        String addressName,

        @NotBlank(message = "Line 1 of the address is required")
        String line1,

        String line2,

        @NotBlank(message = "Building is required")
        String building,

        @NotBlank(message = "Apartment is required")
        String apartment,

        @NotBlank(message = "City is required")
        String city,

        @NotBlank(message = "Postal code is required")
        String postalCode,

        @NotBlank(message = "Country is required")
        String country
) {}
