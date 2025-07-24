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
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

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

    @NotNull
    private String name;

    @NotNull
    private DeliveryType type;

    @NotNull
    private LocationStatus status;

    @OneToOne
    @JoinColumn(name = "address_id", nullable = false)
    private Address address;

    public PredefinedLocation(
            @NotNull String name,@NotNull DeliveryType type, Address address
    ){
        this.name = name;
        this.type = type;
        this.address = address;
        this.status = LocationStatus.AVAILABLE;
    }

}
