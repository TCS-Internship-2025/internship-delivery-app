package com.tcs.dhv.domain.dto;

import com.tcs.dhv.domain.enums.ParcelStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

public record ParcelStatusHistoryDto(
        UUID id,
        UUID parcelId,
        ParcelStatus status,
        String description,
        LocalDateTime timestamp
) {}
