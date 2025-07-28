package com.tcs.dhv.domain.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record RecipientDto(
    @NotBlank(message = "Recipient's name is required")
    @Size(min = 1, max = 100, message = "Name must be 1-100 characters")
    String name,

    @NotBlank(message = "Recipient's email address is required")
    @Email(message = "Invalid email format")
    @Size(max = 254, message = "Email cannot exceed 254 characters")
    String email,

    @Pattern(regexp = "^\\+36[1-9][0-9]{7,8}$", message = "Invalid Hungarian phone number format (+36XXXXXXXXX)")
    String phone,

    @Past(message = "Date of birth must be in the past")
    LocalDate birthDate,

    @Valid
    AddressRequest address
) {
}