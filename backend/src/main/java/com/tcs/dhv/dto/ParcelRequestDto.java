package com.tcs.dhv.dto;

import com.tcs.dhv.enums.DeliveryType;
import com.tcs.dhv.enums.PaymentType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record ParcelRequestDto(
    @NotNull(message = "Recipient information is required")
    @Valid
    RecipientDto recipientDto,

    @NotNull(message = "Address information is required")
    @Valid
    AddressRequestDto address,

    @NotNull(message = "Payment type is required")
    PaymentType paymentType,

    @NotNull(message = "Delivery type is required")
    DeliveryType deliveryType
){}
