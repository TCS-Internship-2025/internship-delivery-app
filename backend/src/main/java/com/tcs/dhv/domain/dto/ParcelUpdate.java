package com.tcs.dhv.domain.dto;

import com.tcs.dhv.domain.enums.DeliveryType;
import jakarta.validation.Valid;

public record ParcelUpdate(
    @Valid
    AddressUpdate address,

    DeliveryType deliveryType
) {
}
