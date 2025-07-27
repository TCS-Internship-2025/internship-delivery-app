package com.tcs.dhv.domain.entity;

import com.tcs.dhv.domain.enums.DeliveryType;
import com.tcs.dhv.domain.enums.LocationStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "predefined_locations")
@Entity
public class PredefinedLocation {

    @Id
    @Setter(AccessLevel.NONE)
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull
    private String name;

    @NotNull
    @Enumerated(EnumType.STRING)
    private DeliveryType type;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private LocationStatus status = LocationStatus.AVAILABLE;

    @OneToOne
    @NotNull
    @JoinColumn(name = "address_id", nullable = false)
    private Address address;


}
