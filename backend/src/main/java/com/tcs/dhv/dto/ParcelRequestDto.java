package com.tcs.dhv.dto;

import com.tcs.dhv.enums.DeliveryType;
import com.tcs.dhv.enums.PaymentType;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ParcelRequestDto(
    //Section 1: recipient's details
    @NotNull(message = "Recipient's details is required")
    @Valid
    RecipientDto recipientDto,

    //Section 2:Address details
    @NotNull(message = "Address is required")
    @Valid
    AddressDto address,

    //Section 3: enums
    @NotNull(message = "Payment type is required")
    PaymentType paymentType,

    @NotNull(message = "Delivery type is required")
    DeliveryType deliveryType
    ){}
