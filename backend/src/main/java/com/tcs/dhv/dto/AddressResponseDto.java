package com.tcs.dhv.dto;

public record AddressResponseDto(
        String line1,
        String line2,
        String building,
        String apartment,
        String city,
        String postalCode,
        String country,
        Double latitude,
        Double longitude
) {}