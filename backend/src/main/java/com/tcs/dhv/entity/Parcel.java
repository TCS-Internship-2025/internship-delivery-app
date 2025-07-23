package com.tcs.dhv.entity;

import com.tcs.dhv.enums.DeliveryType;
import com.tcs.dhv.enums.ParcelStatus;
import com.tcs.dhv.enums.PaymentType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@Getter
@Setter
@ToString
public class Parcel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.NONE)
    private Long id;

    @NonNull
    private Long senderId;

    @NonNull
    private Long recipientAddressId;

    @NonNull
    private Long trackingCode;

    @NonNull
    private DeliveryType deliveryType;

    @NonNull
    private LocalDateTime createdAt;

    @NonNull
    // originally same as createdAt
    private LocalDateTime updatedAt;

    @NonNull
    //should set a default
    private ParcelStatus currentStatus;

    @NonNull
    private PaymentType paymentType;


    public Parcel(@NonNull Long senderId, @NonNull Long recipientAddressId,
                  @NonNull DeliveryType deliveryType, @NonNull PaymentType paymentType) {
        this.senderId = senderId;
        this.recipientAddressId = recipientAddressId;
        this.deliveryType = deliveryType;
        this.updatedAt = this.createdAt = LocalDateTime.now();
        this.currentStatus = ParcelStatus.CREATED;
        this.paymentType = paymentType;
    }
}
