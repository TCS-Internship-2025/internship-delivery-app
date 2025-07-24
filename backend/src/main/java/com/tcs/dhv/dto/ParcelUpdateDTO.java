package com.tcs.dhv.dto;

import com.tcs.dhv.enums.DeliveryType;
import jakarta.validation.Valid;

public record ParcelUpdateDTO(
        @Valid
        AddressUpdateDTO address,

        DeliveryType deliveryType
){}
