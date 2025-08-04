package com.tcs.dhv.domain.dto;

import com.tcs.dhv.domain.entity.ParcelStatusHistory;
import com.tcs.dhv.domain.enums.ParcelStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record ParcelStatusHistoryDto(
        UUID id,
        UUID parcelId,
        ParcelStatus status,
        String description,
        LocalDateTime timestamp
) {
    public static ParcelStatusHistoryDto fromEntity(ParcelStatusHistory entity) {
        return new ParcelStatusHistoryDto(
                entity.getId(),
                entity.getParcel().getId(),
                entity.getStatus(),
                entity.getDescription(),
                entity.getTimestamp()
        );
    }
}
