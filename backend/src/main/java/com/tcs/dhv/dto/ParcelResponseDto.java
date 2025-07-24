package com.tcs.dhv.dto;

import com.tcs.dhv.enums.DeliveryType;
import com.tcs.dhv.enums.PaymentType;

public record ParcelResponseDto(
        Long id,

        String trackingCode,

        String currentStatus,

        RecipientDto recipient,

        AddressDto address,

        DeliveryType deliveryType,

        PaymentType paymentType
) {}
