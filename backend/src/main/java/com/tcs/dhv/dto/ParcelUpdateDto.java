package com.tcs.dhv.dto;

import com.tcs.dhv.enums.DeliveryType;
import jakarta.validation.Valid;

public record ParcelUpdateDto(
        @Valid
        AddressUpdateDto address,

        DeliveryType deliveryType
){}
