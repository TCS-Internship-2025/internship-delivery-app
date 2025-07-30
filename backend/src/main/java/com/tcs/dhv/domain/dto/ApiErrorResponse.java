package com.tcs.dhv.domain.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

import java.time.Instant;
import java.util.List;

@Schema(description = "The Api's error response containing error details")
@Builder
public record ApiErrorResponse(
    @Schema(description = "HTTP status code")
    int status,

    @Schema(description = "Error message description")
    String message,

    @Schema(description = "Timestamp when the error occurred")
    Instant timestamp,

    @Schema(description = "List of field-specific validation errors")
    List<FieldError> errors
) {
    @Schema(description = "Field-specific validation error")
    public record FieldError(
        @Schema(description = "Name of the field that failed validation")
        String field,

        @Schema(description = "Validation error message")
        String message
    ) {
    }
}