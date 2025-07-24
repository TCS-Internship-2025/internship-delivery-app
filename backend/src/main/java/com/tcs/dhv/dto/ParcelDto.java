package com.tcs.dhv.dto;

import com.tcs.dhv.enums.DeliveryType;
import com.tcs.dhv.enums.PaymentType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ParcelDto(
    //Section 1: recipient's details
    String title,

    @NotBlank(message = "Recipient's name is required")
    String recipientFirstName,

    @NotBlank(message = "Recipient's name is required")
    String recipientLastName,

    @NotBlank(message = "Recipient's date of birth is required")
    String recipientDateOfBirth,

    String moreData,

    @NotBlank(message = "Recipient's phone number is required")
    String recipientPhone,

    @NotBlank(message = "Recipient's email address is required")
    String recipientEmail,

    //Section 2:Address details
    @NotBlank(message = "Address name is required")
    String addressName,

    @NotBlank(message = "Line 1 of the address is required")
    String line1,

    String line2,

    @NotBlank(message = "Building is required")
    String building,

    @NotBlank(message = "Apartment is required")
    String apartment,

    @NotBlank(message = "City is required")
    String city,

    @NotBlank(message = "Postal code is required")
    String postalCode,

    @NotBlank(message = "Country is required")
    String country,

    //Section 3: enums
    @NotNull(message = "Payment type is required")
    PaymentType paymentType,

    @NotNull(message = "Delivery type is required")
    DeliveryType deliveryType
    ){}
