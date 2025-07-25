package com.tcs.dhv.entity;

import com.tcs.dhv.enums.DeliveryType;
import com.tcs.dhv.enums.LocationStatus;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
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
@Table(name = "predefined_locations")
public class PredefinedLocation {

    @Id
    @Setter(AccessLevel.NONE)
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull
    private String name;

    @NotNull
    private DeliveryType type;

    @NotNull
    private LocationStatus status;

    @OneToOne
    @JoinColumn(name = "address_id", nullable = false)
    private Address address;

    @Builder
    public PredefinedLocation(
            @NotNull String name,
            @NotNull DeliveryType type,
            @NotNull Address address,
            LocationStatus status
    ){
        this.name = name;
        this.type = type;
        this.address = address;
        this.status = status != null ? status : LocationStatus.AVAILABLE;
    }

}
