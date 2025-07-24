package com.tcs.dhv.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.Optional;

public record RecipientDto(
        String title,

        @NotBlank(message = "Recipient's name is required")
        String recipientFirstName,

        @NotBlank(message = "Recipient's name is required")
        String recipientLastName,

        @NotBlank(message = "Recipient's date of birth is required")
        String recipientDateOfBirth,

        Optional<String> moreData,

        @NotBlank(message = "Recipient's phone number is required")
        String recipientPhone,

        @NotBlank(message = "Recipient's email address is required")
        String recipientEmail
) {}
