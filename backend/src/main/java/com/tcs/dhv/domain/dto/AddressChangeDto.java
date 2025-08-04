package com.tcs.dhv.domain.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AddressChangeDto(
    @NotNull
    @Valid
    AddressDto newAddress,

    @Size(max = 500, message = "Request reason cannot exceed {max} characters")
    String requestReason
) {
}
