package com.tcs.dhv.domain.dto;

import com.tcs.dhv.domain.entity.PredefinedLocation;
import com.tcs.dhv.domain.enums.DeliveryType;

import java.util.UUID;

public record LocationDto(
    UUID id,
    String name,
    Double latitude,
    Double longitude,
    DeliveryType deliveryType,
    AddressDto address
) {
    public static LocationDto fromEntity(PredefinedLocation location) {
        return new LocationDto(
            location.getId(),
            location.getName(),
            location.getAddress().getLatitude(),
            location.getAddress().getLongitude(),
            location.getDeliveryType(),
            AddressDto.fromEntity(location.getAddress())
        );
    }
}
