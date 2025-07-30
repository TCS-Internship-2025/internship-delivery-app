package com.tcs.dhv.domain.dto;

import com.tcs.dhv.domain.entity.PredefinedLocation;
import com.tcs.dhv.domain.enums.DeliveryType;

import java.util.UUID;

public record LocationResponse(
    UUID id,
    String name,
    Double latitude,
    Double longitude,
    DeliveryType deliveryType,
    AddressDto address
) {
    public static LocationResponse fromEntity(PredefinedLocation location) {
        return new LocationResponse(
            location.getId(),
            location.getName(),
            location.getAddress().getLatitude(),
            location.getAddress().getLongitude(),
            location.getDeliveryType(),
            AddressDto.fromEntity(location.getAddress())
        );
    }
}
