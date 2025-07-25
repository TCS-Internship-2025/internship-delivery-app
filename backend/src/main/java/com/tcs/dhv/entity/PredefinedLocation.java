package com.tcs.dhv.entity;

import com.tcs.dhv.enums.DeliveryType;
import com.tcs.dhv.enums.LocationStatus;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import java.util.UUID;

@Entity
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "predefined_locations")
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
