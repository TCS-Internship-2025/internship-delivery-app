package com.tcs.dhv.domain.dto;

import com.tcs.dhv.domain.entity.User;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record UserProfileDto(
    String name,
    String email,
    String phone,
    AddressDto address,
    boolean isVerified,

    LocalDateTime createdAt,
    LocalDateTime updatedAt
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

    public void updateBasicInfo(final User user) {
        if(name != null && !name.isBlank()) user.setName(name);

        if(email != null && !email.isBlank()) user.setEmail(email);

        if(phone != null && !phone.isBlank()) user.setPhone(phone);

        //if(address != null && user.getAddress() != null) address.updateEntity(user.getAddress());
    }

    public void updateAddress(final User user) {
        if(address != null){
            if(user.getAddress() != null) address.updateEntity(user.getAddress());
        } else {
            user.setAddress(address.toEntity());
        }
    }

    public void updatePassword(final User user) {
        //TODO
    }

    public void updateFullProfile(final User user) {
        updateBasicInfo(user);
        updateAddress(user);
        updatePassword(user);
    }
}
