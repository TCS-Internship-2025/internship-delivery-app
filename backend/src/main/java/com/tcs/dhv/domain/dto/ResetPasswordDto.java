package com.tcs.dhv.domain.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ResetPasswordDto(
    @NotBlank
    @Size(min = 8, message = "Password must be at least {min} characters")
    String newPassword
) {
}
