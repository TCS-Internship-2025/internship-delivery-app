package com.tcs.dhv.entity;

import com.tcs.dhv.enums.DeliveryType;
import com.tcs.dhv.enums.ParcelStatus;
import com.tcs.dhv.enums.PaymentType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@ToString
@NoArgsConstructor
@Table(name = "parcels")
public class Parcel {

    @Id
    @Setter(AccessLevel.NONE)
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "sender_id")
    private User sender;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "recipient_address_id")
    private Address recipientAddress;

    @NotNull
    @Column(name = "tracking_code")
    private String trackingCode;

    @NotNull
    @Column(name = "delivery_type")
    private DeliveryType deliveryType;

    @NotNull
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @NotNull
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @NotNull
    @Column(name = "current_status")
    private ParcelStatus currentStatus;

    @NotNull
    @Column(name = "payment_type")
    private PaymentType paymentType;


    public Parcel(
            @NotNull User sender,
            @NotNull Address recipientAddress,
            @NotNull DeliveryType deliveryType,
            @NotNull PaymentType paymentType
    ){
        this.sender = sender;
        this.recipientAddress = recipientAddress;
        this.deliveryType = deliveryType;
        this.paymentType = paymentType;
        this.currentStatus = ParcelStatus.CREATED;
    }
}
