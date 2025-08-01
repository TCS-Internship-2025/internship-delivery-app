package com.tcs.dhv.domain.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

public record ParcelStatusHistoryDto(
        UUID id,
        UUID parcelId,
        String status,
        String description,
        LocalDateTime timestamp
) {}
