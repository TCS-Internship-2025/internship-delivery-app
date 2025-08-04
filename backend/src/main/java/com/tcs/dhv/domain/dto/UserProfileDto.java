package com.tcs.dhv.domain.dto;

import com.tcs.dhv.domain.entity.User;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record UserProfileDto(
    String name,

    @Email
    @Size(max = 254, message = "Email cannot exceed 254 characters")
    String email,

    @Pattern(regexp = "^\\+36[1-9][0-9]{7,8}$",
        message = "Phone number must be 11 digits starting with 36 (format: 36XXXXXXXXX)"
    )
    String phone,

    @Valid
    AddressDto address,

    boolean isVerified,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,

    String currentPassword,

    @Size(min = 8, max = 128,
        message = "New password must be between 8 and 128 characters")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&+=!?.,;:~`<>{}\\[\\]()_-]).{8,128}$",
    message = "Password must contain at least 1 lowercase, uppercase letter, digit and special character")
    String newPassword
) {
    public static UserProfileDto fromEntity(final User user) {
        return UserProfileDto.builder()
            .name(user.getName())
            .email(user.getEmail())
            .phone(user.getPhone())
            .address(user.getAddress() != null ?
                AddressDto.fromEntity(user.getAddress()) : null)
            .isVerified(user.getIsVerified())
            .createdAt(user.getCreatedAt())
            .updatedAt(user.getUpdatedAt())
            .build();
    }

    public void updateEntity(final User user) {
        if(name != null && !name.isBlank()) user.setName(name);
        if(email != null && !email.isBlank()) user.setEmail(email);
        if(phone != null && !phone.isBlank()) user.setPhone(phone);
        if(address != null) {
            if (user.getAddress() != null){
                address.updateEntity(user.getAddress());
            } else {
                user.setAddress(address.toEntity());
            }
        }
    }
}
