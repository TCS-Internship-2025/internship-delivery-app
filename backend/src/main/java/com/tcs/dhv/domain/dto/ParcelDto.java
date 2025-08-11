package com.tcs.dhv.domain.dto;

import com.tcs.dhv.config.openapi.SchemaConstants;
import com.tcs.dhv.domain.entity.Parcel;
import com.tcs.dhv.domain.enums.DeliveryType;
import com.tcs.dhv.domain.enums.ParcelStatus;
import com.tcs.dhv.domain.enums.PaymentType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

@Schema(description = "Parcel record")
public record ParcelDto(
    @Schema(description = SchemaConstants.PARCEL_ID_DESC, example = SchemaConstants.PARCEL_ID_EX)
    UUID id,

    @Schema(description = SchemaConstants.TRACKING_CODE_DESC, example = SchemaConstants.TRACKING_CODE_EX)
    String trackingCode,

    @Schema(description = "Delivery address")
    @NotNull(message = "Address is required")
    @Valid
    AddressDto address,

    @Schema(description = "Recipient information")
    @NotNull(message = "Recipient is required")
    @Valid
    RecipientDto recipient,

    @Schema(description = "Parcel status", example = "CREATED")
    ParcelStatus currentStatus,

    @Schema(description = "Delivery type",example = "PICKUP_POINT")
    @NotNull(message = "Delivery type is required")
    DeliveryType deliveryType,

    @Schema(description = "Payment type", example = "SENDER_PAYS")
    @NotNull(message = "Payment type is required")
    PaymentType paymentType,

    @Schema(description = "Creation time of parcel", example = "2025-07-30T10:30:00")
    LocalDateTime createdAt,

    @Schema(description = "Last update time of parcel", example = "2025-07-30T10:30:00")
    LocalDateTime updatedAt
) implements Serializable {
    public static ParcelDto fromEntity(final Parcel parcel) {
        return new ParcelDto(
            parcel.getId(),
            parcel.getTrackingCode(),
            AddressDto.fromEntity(parcel.getAddress()),
            RecipientDto.fromEntity(parcel.getRecipient()),
            parcel.getCurrentStatus(),
            parcel.getDeliveryType(),
            parcel.getPaymentType(),
            parcel.getCreatedAt(),
            parcel.getUpdatedAt()
        );
    }
}
