package com.tcs.dhv.domain.dto;

import com.tcs.dhv.config.openapi.SchemaConstants;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import com.tcs.dhv.domain.entity.Recipient;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

@Schema(description = "Recipient information for parcel delivery")
public record RecipientDto(
    @Size(min = 1, max = 100, message = "Name must be between {min} and {max} characters")
    String name,

    @Email(message = "Invalid email format")
    @Size(max = 254, message = "Email cannot exceed {max} characters")
    String email,

    @Pattern(regexp = "^\\+36[1-9][0-9]{7,8}$", message = "Invalid Hungarian phone number format (+36XXXXXXXXX)")
    String phone,

    @Past(message = "Date of birth must be in the past")
    LocalDate birthDate,

    @Valid
    AddressDto address
) {
    public static RecipientDto fromEntity(final Recipient recipient) {
        return new RecipientDto(
            recipient.getName(),
            recipient.getEmail(),
            recipient.getPhone(),
            recipient.getBirthDate(),
            AddressDto.fromEntity(recipient.getAddress())
        );
    }

    public Recipient toEntity() {
        return Recipient.builder()
            .name(name)
            .email(email)
            .phone(phone)
            .birthDate(birthDate)
            .address(address.toEntity())
            .build();
    }
}