package com.tcs.dhv.entity;

import com.tcs.dhv.enums.ParcelStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.UUID;


@Entity
@NoArgsConstructor
@Setter
@Getter
@ToString
public class ParcelStatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // for BIGSERIAL / auto-increment
    private Long id;

    @NonNull
    @Column(name = "Parcel_id")
    private UUID parcelId;

    @NonNull
    private ParcelStatus status;

    private String description;

    @NonNull
    // set in db
    private OffsetDateTime  timestamp;

    public ParcelStatusHistory(@NonNull UUID parcelId, @NonNull ParcelStatus status,
                               String description) {
        this.parcelId = parcelId;
        this.status = status;
        this.description = description;
    }


}
