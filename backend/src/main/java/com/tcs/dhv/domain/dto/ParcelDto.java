package com.tcs.dhv.domain.dto;

import com.tcs.dhv.domain.entity.Parcel;
import com.tcs.dhv.domain.entity.User;
import com.tcs.dhv.domain.enums.DeliveryType;
import com.tcs.dhv.domain.enums.PaymentType;

import java.time.LocalDateTime;
import java.util.UUID;

public record ParcelDto(
    UUID id,
    String trackingCode,
    RecipientDto recipient,
    String currentStatus,
    DeliveryType deliveryType,
    PaymentType paymentType,
    LocalDateTime createdAt,
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
