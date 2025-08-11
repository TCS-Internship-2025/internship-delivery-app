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

    @Schema(description = SchemaConstants.PARCEL_ADDRESS_DESC)
    @NotNull(message = "Address is required")
    @Valid
    AddressDto address,

    @Schema(description = SchemaConstants.PARCEL_RECIPIENT_DESC)
    @NotNull(message = "Recipient is required")
    @Valid
    RecipientDto recipient,

    @Schema(description = SchemaConstants.PARCEL_STATUS_DESC, example = SchemaConstants.PARCEL_STATUS_EX)
    ParcelStatus currentStatus,

    @Schema(description = SchemaConstants.PARCEL_DELIVERY_TYPE_DESC, example = SchemaConstants.PARCEL_DELIVERY_TYPE_EX)
    @NotNull(message = "Delivery type is required")
    DeliveryType deliveryType,

    @Schema(description = SchemaConstants.PARCEL_PAYMENT_TYPE_DESC, example = SchemaConstants.PARCEL_PAYMENT_TYPE_EX)
    @NotNull(message = "Payment type is required")
    PaymentType paymentType,

    @Schema(description = SchemaConstants.PARCEL_CREATED_AT_DESC, example = SchemaConstants.PARCEL_CREATED_AT_EX)
    LocalDateTime createdAt,

    @Schema(description = SchemaConstants.PARCEL_UPDATED_AT_DESC, example = SchemaConstants.PARCEL_UPDATED_AT_EX)
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
