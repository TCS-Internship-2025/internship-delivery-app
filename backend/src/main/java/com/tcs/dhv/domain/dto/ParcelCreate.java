package com.tcs.dhv.domain.dto;

import com.tcs.dhv.domain.entity.Parcel;
import com.tcs.dhv.domain.entity.User;
import com.tcs.dhv.domain.enums.DeliveryType;
import com.tcs.dhv.domain.enums.PaymentType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ParcelCreate {
    @NotNull(message = "Recipient information is required")
    @Valid
    RecipientCreate recipient;

    @NotNull(message = "Delivery type is required")
    DeliveryType deliveryType;

    @NotNull(message = "Payment type is required")
    PaymentType paymentType;

    public Parcel toEntity(final User sender, final String trackingCode) {
        return Parcel.builder()
            .sender(sender)
            .recipient(recipient.toEntity())
            .trackingCode(trackingCode)
            .paymentType(paymentType)
            .deliveryType(deliveryType)
            .build();
    }
}
