package com.tcs.dhv.entity;

import com.tcs.dhv.enums.DeliveryType;
import com.tcs.dhv.enums.ParcelStatus;
import com.tcs.dhv.enums.PaymentType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@NoArgsConstructor
@Getter
@Setter
@ToString
public class Parcel {

    @Id
    @Setter(AccessLevel.NONE)
    private UUID id;

    @NonNull
    @Column(name = "Sender_id")
    private UUID senderId;

    @NonNull
    @Column(name = "Recipient_address_id")
    private UUID recipientAddressId;

    @NonNull
    @Column(name = "Tracking_code")
    private Long trackingCode;

    @NonNull
    @Column(name = "Delivery_type")
    private DeliveryType deliveryType;

    @NonNull
    @Column(name = "Created_at")
    private LocalDateTime createdAt;

    @NonNull
    @Column(name = "Updated_at")
    private LocalDateTime updatedAt;

    @NonNull
    @Column(name = "current_ status")
    private ParcelStatus currentStatus;

    @NonNull
    @Column(name = "Payment_type")
    private PaymentType paymentType;


    public Parcel(@NonNull UUID senderId, @NonNull UUID recipientAddressId,
                  @NonNull DeliveryType deliveryType, @NonNull PaymentType paymentType) {
        this.senderId = senderId;
        this.recipientAddressId = recipientAddressId;
        this.deliveryType = deliveryType;
        this.currentStatus = ParcelStatus.CREATED;
        this.paymentType = paymentType;
    }
}
