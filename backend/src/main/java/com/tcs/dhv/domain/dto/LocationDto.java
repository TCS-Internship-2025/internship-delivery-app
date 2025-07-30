package com.tcs.dhv.domain.dto;

import com.tcs.dhv.domain.entity.PredefinedLocation;

import java.util.UUID;

public record LocationDto(
    UUID id,
    String name,
    Double latitude,
    Double longitude,
    AddressDto address
) {
    public static LocationDto fromEntity(PredefinedLocation location) {
        return new LocationDto(
            location.getId(),
            location.getName(),
            location.getAddress().getLatitude(),
            location.getAddress().getLongitude(),
            AddressDto.fromEntity(location.getAddress())
        );
    }
}
