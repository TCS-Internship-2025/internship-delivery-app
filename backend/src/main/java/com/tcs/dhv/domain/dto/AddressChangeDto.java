package com.tcs.dhv.domain.dto;

import com.tcs.dhv.domain.enums.DeliveryType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AddressChangeDto(
    @NotNull(message = "New address is required")
    @Valid
    AddressDto newAddress,

    @NotNull(message = "Delivery type is required")
    DeliveryType deliveryType,

    @Size(max = 500, message = "Request reason cannot exceed {max} characters")
    String requestReason
) {
}
