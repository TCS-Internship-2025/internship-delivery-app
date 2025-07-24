package com.tcs.dhv.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;

import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@ToString
public class PredefinedLocation {

    @Id
    @Setter(AccessLevel.NONE)
    private UUID id;

    @NonNull
    private String name;

    @NonNull
    private String type;

    @NonNull
    private String status;

    @Column(name = "Address_id")
    private UUID addressId;

    public PredefinedLocation(@NonNull String name,@NonNull String type,
                              UUID addressId) {
        this.name = name;
        this.type = type;
        this.addressId = addressId;
    }




}
