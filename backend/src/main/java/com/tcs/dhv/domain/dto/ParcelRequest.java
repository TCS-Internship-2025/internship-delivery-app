package com.tcs.dhv.domain.dto;

import com.tcs.dhv.domain.enums.DeliveryType;
import com.tcs.dhv.domain.enums.PaymentType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Schema(description = "Request to create a new parcel")
public record ParcelRequest(
    @Schema(description = "Recipient information")
    @NotNull(message = "Recipient information is required")
    @Valid
    RecipientDto recipient,

    @Schema(description = "Payment type", example = "SENDER_PAYS")
    @NotNull(message = "Payment type is required")
    PaymentType paymentType,

    @Schema(description = "Delivery type",example = "PICKUP_POINT")
    @NotNull(message = "Delivery type is required")
    DeliveryType deliveryType
) {
}
