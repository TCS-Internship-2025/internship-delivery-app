package com.tcs.dhv.domain.dto;

import com.tcs.dhv.domain.entity.Parcel;
import com.tcs.dhv.domain.enums.DeliveryType;
import com.tcs.dhv.domain.enums.PaymentType;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Builder
public class ParcelResponse {
    UUID id;
    String trackingCode;
    RecipientCreate recipient;
    String currentStatus;
    DeliveryType deliveryType;
    PaymentType paymentType;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;

    public static ParcelResponse fromEntity(final Parcel parcel) {
        return ParcelResponse.builder()
            .id(parcel.getId())
            .trackingCode(parcel.getTrackingCode())
            .currentStatus(parcel.getCurrentStatus().name())
            .recipient(RecipientCreate.fromEntity(parcel.getRecipient()))
            .deliveryType(parcel.getDeliveryType())
            .paymentType(parcel.getPaymentType())
            .createdAt(parcel.getCreatedAt())
            .updatedAt(parcel.getUpdatedAt())
            .build();
    }
}
