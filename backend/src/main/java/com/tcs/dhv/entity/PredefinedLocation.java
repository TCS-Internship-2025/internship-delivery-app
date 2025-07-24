package com.tcs.dhv.entity;

import com.tcs.dhv.enums.DeliveryType;
import com.tcs.dhv.enums.LocationStatus;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@ToString
@Table(name = "predefined_locations")
public class PredefinedLocation {

    @Id
    @Setter(AccessLevel.NONE)
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NonNull
    private String name;

    @NonNull
    private DeliveryType type;

    @NonNull
    private LocationStatus status;

    @OneToOne
    @JoinColumn(name = "address_id", nullable = false)
    private Address address;

    public PredefinedLocation(@NonNull String name,@NonNull DeliveryType type,
                              Address address) {
        this.name = name;
        this.type = type;
        this.address = address;
        this.status = LocationStatus.AVAILABLE;
    }




}
