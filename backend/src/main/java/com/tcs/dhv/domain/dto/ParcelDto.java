package com.tcs.dhv.domain.dto;

import com.tcs.dhv.domain.entity.Parcel;
import com.tcs.dhv.domain.entity.User;
import com.tcs.dhv.domain.enums.DeliveryType;
import com.tcs.dhv.domain.enums.ParcelStatus;
import com.tcs.dhv.domain.enums.PaymentType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

public record ParcelDto(
    UUID id,

    String trackingCode,

    @NotNull(message = "Recipient is required")
    @Valid
    RecipientDto recipient,

    ParcelStatus currentStatus,

    @NotNull(message = "Delivery type is required")
    DeliveryType deliveryType,

    @NotNull(message = "Payment type is required")
    PaymentType paymentType,

    LocalDateTime createdAt,
    LocalDateTime updatedAt
) implements Serializable {
    public static ParcelDto fromEntity(final Parcel parcel) {
        return new ParcelDto(
            parcel.getId(),
            parcel.getTrackingCode(),
            RecipientDto.fromEntity(parcel.getRecipient()),
            parcel.getCurrentStatus(),
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
}
