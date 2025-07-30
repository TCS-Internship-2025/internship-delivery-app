package com.tcs.dhv.domain.dto;

import com.tcs.dhv.domain.entity.Parcel;
import com.tcs.dhv.domain.entity.User;
import com.tcs.dhv.domain.enums.DeliveryType;
import com.tcs.dhv.domain.enums.PaymentType;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.UUID;

@Schema(description = "Parcel record")
public record ParcelDto(
    @Schema(description = "Parcel id", example = "123e4567-e89b-12d3-a456-426614174000")
    UUID id,

    @Schema(description = "Parcel tracking code", example = "HU1363415219JN")
    String trackingCode,

    @Schema(description = "Recipient information")
    RecipientDto recipient,

    @Schema(description = "Parcel status", example = "CREATED")
    String currentStatus,

    @Schema(description = "Delivery type",example = "PICKUP_POINT")
    DeliveryType deliveryType,

    @Schema(description = "Payment type", example = "SENDER_PAYS")
    PaymentType paymentType,

    @Schema(description = "Creation time of parcel", example = "2025-07-30T10:30:00")
    LocalDateTime createdAt,

    @Schema(description = "Last update time of parcel", example = "2025-07-30T10:30:00")
    LocalDateTime updatedAt
) {
    public static ParcelDto fromEntity(final Parcel parcel) {
        return new ParcelDto(
            parcel.getId(),
            parcel.getTrackingCode(),
            RecipientDto.fromEntity(parcel.getRecipient()),
            parcel.getCurrentStatus().name(),
            parcel.getDeliveryType(),
            parcel.getPaymentType(),
            parcel.getCreatedAt(),
            parcel.getUpdatedAt()
        );
    }

    public Parcel toEntity(final User sender, final String trackingCode) {
        return Parcel.builder()
            .sender(sender)
            .recipient(recipient.toEntity())
            .trackingCode(trackingCode)
            .paymentType(paymentType)
            .deliveryType(deliveryType)
            .build();
    }

    public void updateEntity(final Parcel parcel) {
        if (deliveryType != null) parcel.setDeliveryType(deliveryType);
        if (recipient != null) recipient.updateEntity(parcel.getRecipient());
    }
}
