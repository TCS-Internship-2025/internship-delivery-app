package com.tcs.dhv.domain.dto;

import com.tcs.dhv.domain.entity.Recipient;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class RecipientUpdate {
    @Size(min = 1, max = 100, message = "Name must be 1-100 characters")
    String name;

    @Email(message = "Invalid email format")
    @Size(max = 254, message = "Email cannot exceed 254 characters")
    String email;

    @Pattern(regexp = "^\\+36[1-9][0-9]{7,8}$", message = "Invalid Hungarian phone number format (+36XXXXXXXXX)")
    String phone;

    @Past(message = "Date of birth must be in the past")
    LocalDate birthDate;

    @Valid
    AddressUpdate address;

    public void updateEntity(final Recipient recipient) {
        if (name != null) recipient.setName(name);
        if (email != null) recipient.setEmail(email);
        if (phone != null) recipient.setPhone(phone);
        if (birthDate != null) recipient.setBirthDate(birthDate);
        if (address != null) address.updateEntity(recipient.getAddress());
    }
}