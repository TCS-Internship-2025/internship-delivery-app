package com.tcs.dhv.domain.dto;

import com.tcs.dhv.config.openapi.SchemaConstants;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

@Schema(description = "User login request")
@Builder
public record LoginRequest(
    @Schema(description = SchemaConstants.EMAIL_DESC, example = SchemaConstants.EMAIL_EX,
        requiredMode = Schema.RequiredMode.REQUIRED)
    @Email(message = "Email must be valid")
    @NotBlank(message = "Email is required")
    String email,

    @Schema(description = SchemaConstants.PASSWORD_DESC, example = SchemaConstants.PASSWORD_EX,
        requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "Password is required")
    String password
) {
}
