package com.tcs.dhv.dto;

import com.tcs.dhv.enums.DeliveryType;
import com.tcs.dhv.enums.PaymentType;

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
