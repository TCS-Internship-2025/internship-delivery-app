package com.tcs.dhv.domain.dto;

import lombok.Builder;

import java.time.Instant;
import java.util.List;

@Builder
public record ApiErrorResponse(
    int status,
    String message,
    Instant timestamp,
    List<FieldError> errors
) {
    public record FieldError(
        String field,
        String message
    ) {
    }
}