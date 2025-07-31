package com.tcs.dhv.domain.dto;

import com.tcs.dhv.config.openapi.SchemaConstants;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "User registration request")
public record RegisterResponse(
    @Schema(description = SchemaConstants.NAME_DESC, example = SchemaConstants.NAME_EX)
    String name,

    @Schema(description = SchemaConstants.EMAIL_DESC, example = SchemaConstants.EMAIL_EX)
    String email,
    boolean emailVerificationRequired
) {
}