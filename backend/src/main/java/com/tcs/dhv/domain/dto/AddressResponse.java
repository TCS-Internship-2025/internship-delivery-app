package com.tcs.dhv.domain.dto;

public record AddressResponse(
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