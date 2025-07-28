package com.tcs.dhv.domain.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;

@Builder
public record RegisterRequest(
    @NotBlank(message = "Name must be provided")
    String name,

    @Email(message = "Email must be valid")
    @NotBlank(message = "Email is required")
    String email,

    @Size(min = 8, message = "Password must be at least {min} characters")
    @NotBlank(message = "Password is required")
    String password
) {
}