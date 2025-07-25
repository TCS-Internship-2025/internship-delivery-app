package com.tcs.dhv.entity;

import com.tcs.dhv.enums.ParcelStatus;
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


import java.time.OffsetDateTime;
import java.util.UUID;


@Entity
@Setter
@Getter
@ToString
@NoArgsConstructor
@Table(name = "parcel_status_history")
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
    private ParcelStatus status;

    private String description;

    @NotNull
    @Setter(AccessLevel.NONE)
    @CreationTimestamp
    private OffsetDateTime timestamp;

    public ParcelStatusHistory(
            @NotNull Parcel parcel,
            @NotNull ParcelStatus status
    ){
        this.parcel = parcel;
        this.status = status;
    }


}
