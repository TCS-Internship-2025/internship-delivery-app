package com.tcs.dhv.dto;

import com.tcs.dhv.enums.DeliveryType;
import com.tcs.dhv.enums.PaymentType;

import java.time.LocalDateTime;
import java.util.UUID;

public record ParcelResponseDTO(
        UUID id,
        String trackingCode,
        String currentStatus,
        RecipientDTO recipient,
        AddressResponseDTO address,
        DeliveryType deliveryType,
        PaymentType paymentType,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
