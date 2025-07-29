package com.tcs.dhv.domain.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;

@Schema(description = "User registration request")
@Builder
public record RegisterRequest(
    @Schema(description = "User's full name", example = "Ferenc Kiss")
    @NotBlank(message = "Name must be provided")
    String name,

    @Schema(description = "User's email", example = "ferenckiss19823010@gmail.com")
    @Email(message = "Email must be valid")
    @NotBlank(message = "Email is required")
    String email,

    @Schema(description = "User's password", example = "40!OpenSesame")
    @Size(min = 8, message = "Password must be at least {min} characters")
    @NotBlank(message = "Password is required")
    String password
) {
}