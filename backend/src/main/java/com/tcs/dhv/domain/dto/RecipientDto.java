package com.tcs.dhv.domain.dto;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record RecipientDto(
        @Size(max = 10, message = "Recipient's title cannot exceed 10 characters")
        String title,

        @NotBlank(message = "Recipient's first name is required")
        @Size(min = 1, max = 50, message = "First name must be 1-50 characters")
        String firstName,

        @NotBlank(message = "Recipient's last name is required")
        @Size(min = 1, max = 50, message = "Last name must be 1-50 characters")
        String lastName,

        @NotNull(message = "Recipient's date of birth is required")
        @Past(message = "Date of birth must be in the past")
        LocalDate dateOfBirth,

        @NotBlank(message = "Recipient's phone number is required")
        @Pattern(regexp = "^\\+36[1-9][0-9]{7,8}$", message = "Invalid Hungarian phone number format (+36XXXXXXXXX)")
        String phone,

        @NotBlank(message = "Recipient's email address is required")
        @Email(message = "Invalid email format")
        @Size(max = 254, message = "Recipient's email cannot exceed 254 characters")
        String email
) {}
