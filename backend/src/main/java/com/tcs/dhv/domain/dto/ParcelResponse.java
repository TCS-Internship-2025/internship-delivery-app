package com.tcs.dhv.domain.dto;

import com.tcs.dhv.domain.enums.DeliveryType;
import com.tcs.dhv.domain.enums.PaymentType;

import java.time.LocalDateTime;
import java.util.UUID;

public record ParcelResponse(
        UUID id,
        String trackingCode,
        String currentStatus,
        RecipientDto recipient,
        DeliveryType deliveryType,
        PaymentType paymentType,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
