package com.tcs.dhv.domain.dto;

import com.tcs.dhv.domain.enums.DeliveryType;
import jakarta.validation.Valid;

public record ParcelUpdateDto(
        @Valid
        AddressUpdateDto address,

        DeliveryType deliveryType
){}
