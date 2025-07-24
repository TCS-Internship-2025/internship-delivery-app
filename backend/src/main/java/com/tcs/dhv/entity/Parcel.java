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
@Table(name = "parcels")
public class Parcel {

    @Id
    @Setter(AccessLevel.NONE)
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NonNull
    @Column(name = "sender_id")
    private UUID senderId;

    @NonNull
    @Column(name = "recipient_address_id")
    private UUID recipientAddressId;

    @NonNull
    @Column(name = "tracking_code", unique = true)
    private Long trackingCode;

    @NonNull
    @Column(name = "delivery_type")
    private DeliveryType deliveryType;

    @NonNull
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @NonNull
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @NonNull
    @Column(name = "current_ status")
    private ParcelStatus currentStatus;

    @NonNull
    @Column(name = "payment_type")
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
