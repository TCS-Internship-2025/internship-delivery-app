package com.tcs.dhv.domain.dto;

import java.util.UUID;

public record PickupPointDto(
    UUID id,
    String name,
    Double latitude,
    Double longitude,
    AddressDto address
) {
}
