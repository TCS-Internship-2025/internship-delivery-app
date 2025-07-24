package com.tcs.dhv.entity;

import com.tcs.dhv.enums.ParcelStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;



@Entity
@NoArgsConstructor
@Setter
@Getter
@ToString
@Table(name = "parcel_status_history")
public class ParcelStatusHistory {

    @Id
    @Setter(AccessLevel.NONE)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NonNull
    @ManyToOne
    @JoinColumn(name = "parcel_id")
    private Parcel parcel;

    @NonNull
    private ParcelStatus status;

    private String description;

    @NonNull
    private OffsetDateTime  timestamp;

    public ParcelStatusHistory(@NonNull Parcel parcel, @NonNull ParcelStatus status,
                               String description) {
        this.parcel = parcel;
        this.status = status;
        this.description = description;
    }


}
