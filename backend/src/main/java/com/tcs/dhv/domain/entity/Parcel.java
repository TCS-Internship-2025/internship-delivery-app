package com.tcs.dhv.domain.entity;

import com.tcs.dhv.domain.enums.DeliveryType;
import com.tcs.dhv.domain.enums.ParcelStatus;
import com.tcs.dhv.domain.enums.PaymentType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "parcels")
@Entity
public class Parcel {

    @Id
    @Setter(AccessLevel.NONE)
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "recipient_id", nullable = false)
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
    @Builder.Default
    private ParcelStatus currentStatus = ParcelStatus.CREATED;

    @NotNull
    @Enumerated(EnumType.STRING)
    private PaymentType paymentType;

    @Version // for optimistic locking if implemented
    private Long version;
}
