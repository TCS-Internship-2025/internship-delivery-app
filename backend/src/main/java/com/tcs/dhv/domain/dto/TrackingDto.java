package com.tcs.dhv.domain.dto;

import com.tcs.dhv.domain.enums.ParcelStatus;
import lombok.Builder;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Builder
public record TrackingDto(
    UUID parcelId,
    String trackingCode,
    String senderName,
    String senderEmail,
    String senderPhone,
    ParcelStatus currentStatus,
    Optional<LocalDateTime> estimateDelivery,
    RecipientDto recipient,
    String paymentType,
    String deliveryType
) implements Serializable {
}
