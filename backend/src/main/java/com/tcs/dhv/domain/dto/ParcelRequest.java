package com.tcs.dhv.domain.dto;

import com.tcs.dhv.domain.enums.DeliveryType;
import com.tcs.dhv.domain.enums.PaymentType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record ParcelRequest(
    @NotNull(message = "Recipient information is required")
    @Valid
    RecipientDto recipient,

    @NotNull(message = "Payment type is required")
    PaymentType paymentType,

    @NotNull(message = "Delivery type is required")
    DeliveryType deliveryType
) {
}
