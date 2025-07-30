package com.tcs.dhv.domain.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import com.tcs.dhv.domain.entity.Recipient;

import java.time.LocalDate;

@Schema(description = "Recipient information for parcel delivery")
public record RecipientDto(
    @Schema(description = "Recipient's full name", example = "Ferenc Kiss")
    @NotBlank(message = "Recipient's name is required")
    @Size(min = 1, max = 100, message = "Name must be 1-100 characters")
    String name,

    @Schema(description = "Recipient's email", example = "ferenckiss19823010@gmail.com")
    @NotBlank(message = "Recipient's email address is required")
    @Email(message = "Invalid email format")
    @Size(max = 254, message = "Email cannot exceed 254 characters")
    String email,

    @Schema(description = "Recipient's phone number", example = "+36309876543")
    @Pattern(regexp = "^\\+36[1-9][0-9]{7,8}$", message = "Invalid Hungarian phone number format (+36XXXXXXXXX)")
    String phone,

    @Schema(description = "Recipient's birthday", example = "2000-12-12")
    @Past(message = "Date of birth must be in the past")
    LocalDate birthDate,

    @Schema(description = "Recipient's delivery address")
    @Valid
    AddressRequest address
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

    public void updateEntity(final Recipient recipient) {
        if (name != null) recipient.setName(name);
        if (email != null) recipient.setEmail(email);
        if (phone != null) recipient.setPhone(phone);
        if (birthDate != null) recipient.setBirthDate(birthDate);
        if (address != null) address.updateEntity(recipient.getAddress());
    }
}