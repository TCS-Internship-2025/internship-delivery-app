package com.tcs.dhv.domain.dto;

import com.tcs.dhv.domain.enums.DeliveryType;
import com.tcs.dhv.domain.enums.PaymentType;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.UUID;

@Schema(description = "Parcel information response")
public record ParcelResponse(
    @Schema(description = "Parcel id", example = "123e4567-e89b-12d3-a456-426614174000")
    UUID id,

    @Schema(description = "Parcel tracking code")
    String trackingCode,

    @Schema(description = "Parcel status", example = "CREATED")
    String currentStatus,

    @Schema(description = "Recipient information")
    RecipientDto recipient,

    @Schema(description = "Delivery type",example = "PICKUP_POINT")
    DeliveryType deliveryType,

    @Schema(description = "Payment type", example = "SENDER_PAYS")
    PaymentType paymentType,

    @Schema(description = "Creation time of parcel", example = "2025-07-30T10:30.00Z")
    LocalDateTime createdAt,

    @Schema(description = "Last update time of parcel", example = "2025-07-30T10:30.00Z")
    LocalDateTime updatedAt
) {
}
