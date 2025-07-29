package com.tcs.dhv.mapper;

import com.tcs.dhv.domain.dto.ParcelRequest;
import com.tcs.dhv.domain.dto.ParcelResponse;
import com.tcs.dhv.domain.dto.ParcelUpdate;
import com.tcs.dhv.domain.entity.Parcel;
import com.tcs.dhv.domain.entity.User;
import com.tcs.dhv.domain.enums.ParcelStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class ParcelMapper {

    private final RecipientMapper recipientMapper;

    public Parcel toEntity(ParcelRequest dto, User sender, String trackingCode) {
        return Parcel.builder()
            .sender(sender)
            .trackingCode(trackingCode)
            .paymentType(dto.paymentType())
            .deliveryType(dto.deliveryType())
            .currentStatus(ParcelStatus.CREATED)
            .build();
    }

    public ParcelResponse toResponse(Parcel parcel) {
        return new ParcelResponse(
            parcel.getId(),
            parcel.getTrackingCode(),
            parcel.getCurrentStatus().name(),
            recipientMapper.toDto(parcel.getRecipient()),
            parcel.getDeliveryType(),
            parcel.getPaymentType(),
            parcel.getCreatedAt(),
            parcel.getUpdatedAt()
        );
    }

    public void updateEntity(Parcel parcel, ParcelUpdate update) {
        if (update.deliveryType() != null) {
            parcel.setDeliveryType(update.deliveryType());
        }
        if (update.address() != null) {
            recipientMapper.updateEntity(parcel.getRecipient(), update.address());
        }
    }
}