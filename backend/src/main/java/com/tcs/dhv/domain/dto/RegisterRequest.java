package com.tcs.dhv.domain.dto;

import com.tcs.dhv.config.openapi.SchemaConstants;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;

@Schema(description = "User registration request")
@Builder
public record RegisterRequest(
    @Schema(description = SchemaConstants.NAME_DESC, example = SchemaConstants.NAME_EX,
        requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "Name must be provided")
    String name,

    @Schema(description = "User's email", example = SchemaConstants.EMAIL_EX,
        requiredMode = Schema.RequiredMode.REQUIRED)
    @Email(message = "Email must be valid")
    @NotBlank(message = "Email is required")
    String email,

    @Schema(description = SchemaConstants.PASSWORD_DESC,example = SchemaConstants.PASSWORD_EX,
        requiredMode = Schema.RequiredMode.REQUIRED)
    @Size(min = 8, message = "Password must be at least {min} characters")
    @NotBlank(message = "Password is required")
    String password
) {
}