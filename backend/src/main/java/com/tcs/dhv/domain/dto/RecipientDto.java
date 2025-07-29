package com.tcs.dhv.domain.dto;

import com.tcs.dhv.domain.entity.Recipient;

import java.time.LocalDate;

public record RecipientDto(
    String name,
    String email,
    String phone,
    LocalDate birthDate,
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

    public void updateEntity(final Recipient recipient) {
        if (name != null) recipient.setName(name);
        if (email != null) recipient.setEmail(email);
        if (phone != null) recipient.setPhone(phone);
        if (birthDate != null) recipient.setBirthDate(birthDate);
        if (address != null) address.updateEntity(recipient.getAddress());
    }
}