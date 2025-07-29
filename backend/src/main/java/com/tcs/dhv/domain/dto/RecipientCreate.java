package com.tcs.dhv.domain.dto;

import com.tcs.dhv.domain.entity.Recipient;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class RecipientCreate {
    @NotBlank(message = "Recipient's name is required")
    @Size(min = 1, max = 100, message = "Name must be 1-100 characters")
    String name;

    @NotBlank(message = "Recipient's email address is required")
    @Email(message = "Invalid email format")
    @Size(max = 254, message = "Email cannot exceed 254 characters")
    String email;

    @Pattern(regexp = "^\\+36[1-9][0-9]{7,8}$", message = "Invalid Hungarian phone number format (+36XXXXXXXXX)")
    String phone;

    @Past(message = "Date of birth must be in the past")
    LocalDate birthDate;

    @NotNull(message = "Recipient's address is required")
    @Valid
    AddressCreate address;

    public Recipient toEntity() {
        return Recipient.builder()
            .name(name)
            .email(email)
            .phone(phone)
            .birthDate(birthDate)
            .address(address.toEntity())
            .build();
    }

    public static RecipientCreate fromEntity(final Recipient entity) {
        return RecipientCreate.builder()
            .name(entity.getName())
            .email(entity.getEmail())
            .phone(entity.getPhone())
            .birthDate(entity.getBirthDate())
            .address(AddressCreate.fromEntity(entity.getAddress()))
            .build();
    }
}