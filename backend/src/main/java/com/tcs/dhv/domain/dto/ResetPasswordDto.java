package com.tcs.dhv.domain.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ResetPasswordDto(
    @NotBlank
    String token,

    @NotBlank
    @Size(min = 8, message = "Password must be at least {min} characters")
    String newPassword
) {
}