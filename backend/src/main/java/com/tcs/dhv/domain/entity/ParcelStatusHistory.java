package com.tcs.dhv.domain.entity;

import com.tcs.dhv.domain.enums.ParcelStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;


@Setter
@Getter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "parcel_status_history")
@Entity
public class ParcelStatusHistory {

    @Id
    @Setter(AccessLevel.NONE)
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull
    @ManyToOne
    @Setter(AccessLevel.NONE)
    @JoinColumn(name = "parcel_id")
    private Parcel parcel;

    @NotNull
    @Setter(AccessLevel.NONE)
    @Enumerated(EnumType.STRING)
    private ParcelStatus status;

    private String description;

    @NotNull
    @Setter(AccessLevel.NONE)
    @CreationTimestamp
    private LocalDateTime timestamp;
}
