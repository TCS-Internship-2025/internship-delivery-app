package com.tcs.dhv.domain.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

@Schema(description = "User login request")
@Builder
public record LoginRequest(
    @Schema(description = "User's email", example = "ferenckiss19823010@gmail.com")
    @Email(message = "Email must be valid")
    @NotBlank(message = "Email is required")
    String email,

    @Schema(description = "User's password", example = "40!OpenSesame")
    @NotBlank(message = "Password is required")
    String password
) {
}