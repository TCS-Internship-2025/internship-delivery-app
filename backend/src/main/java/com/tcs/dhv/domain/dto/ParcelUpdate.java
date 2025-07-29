package com.tcs.dhv.domain.dto;

import com.tcs.dhv.domain.entity.Parcel;
import com.tcs.dhv.domain.enums.DeliveryType;
import jakarta.validation.Valid;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ParcelUpdate {
    @Valid
    AddressUpdate address;

    DeliveryType deliveryType;

    public void updateEntity(final Parcel parcel) {
        if (address != null) {
            address.updateEntity(parcel.getRecipient().getAddress());
        }
        if (deliveryType != null) {
            parcel.setDeliveryType(deliveryType);
        }
    }
}
