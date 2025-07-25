package com.tcs.dhv.domain.dto;

import com.tcs.dhv.domain.enums.DeliveryType;
import com.tcs.dhv.domain.enums.PaymentType;

import java.time.LocalDateTime;
import java.util.UUID;

public record ParcelResponseDto(
        UUID id,
        String trackingCode,
        String currentStatus,
        RecipientDto recipient,
        AddressResponseDto address,
        DeliveryType deliveryType,
        PaymentType paymentType,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
