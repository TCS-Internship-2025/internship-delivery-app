package com.tcs.dhv.dto;

import com.tcs.dhv.enums.DeliveryType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.util.Optional;

public record ParcelUpdateDto(
        @NotNull(message = "Address is required")
        @Valid
        AddressUpdateDto address,

        Optional<DeliveryType> deliveryType

){}
