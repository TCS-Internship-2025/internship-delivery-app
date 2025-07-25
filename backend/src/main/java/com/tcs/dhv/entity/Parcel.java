package com.tcs.dhv.entity;

import com.tcs.dhv.enums.DeliveryType;
import com.tcs.dhv.enums.ParcelStatus;
import com.tcs.dhv.enums.PaymentType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Builder;
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
    @JoinColumn(name = "recipient_id")
    private Recipient recipient;

    @NotNull
    private String trackingCode;

    @NotNull
    @Enumerated(EnumType.STRING)
    private DeliveryType deliveryType;

    @NotNull
    @CreationTimestamp
    private LocalDateTime createdAt;

    @NotNull
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @NotNull
    @Enumerated(EnumType.STRING)
    private ParcelStatus currentStatus;

    @NotNull
    @Enumerated(EnumType.STRING)
    private PaymentType paymentType;

    @Builder
    public Parcel(
            @NotNull User sender,
            @NotNull Recipient recipient,
            @NotNull String trackingCode,
            @NotNull DeliveryType deliveryType,
            ParcelStatus currentStatus,
            @NotNull PaymentType paymentType) {
        this.sender = sender;
        this.recipient = recipient;
        this.trackingCode = trackingCode;
        this.deliveryType = deliveryType;
        this.currentStatus = currentStatus != null ? currentStatus : ParcelStatus.CREATED;
        this.paymentType = paymentType;
    }
}
