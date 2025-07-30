package com.tcs.dhv.domain.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class ParcelStatusHistoryDto {
    private UUID id;
    private UUID parcelId;
    private String status;
    private String description;
    private LocalDateTime timestamp;

    public ParcelStatusHistoryDto() {}

    public ParcelStatusHistoryDto(UUID id, UUID parcelId, String status, String description, LocalDateTime timestamp) {
        this.id = id;
        this.parcelId = parcelId;
        this.status = status;
        this.description = description;
        this.timestamp = timestamp;
    }
}
