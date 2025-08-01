package com.tcs.dhv.domain.dto;

import com.tcs.dhv.domain.entity.PredefinedLocation;
import com.tcs.dhv.domain.enums.DeliveryType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record LocationDto(
    UUID id,

    @NotBlank(message = "Location name is required")
    String name,

    // Source: https://www.latlong.net/place/budapest-hungary-23565.html
    // Ranges are an approximation
    @DecimalMin(value = "47.0", message = "Latitude must be between 47.0 and 48.0")
    @DecimalMax(value = "48.0", message = "Latitude must be between 47.0 and 48.0")
    Double latitude,

    @DecimalMin(value = "18.0", message = "Longitude must be between 18.0 and 20.0")
    @DecimalMax(value = "20.0", message = "Longitude must be between 18.0 and 20.0")
    Double longitude,

    @NotNull(message = "Delivery type is required")
    DeliveryType deliveryType,

    @NotNull(message = "Address is required")
    @Valid
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
