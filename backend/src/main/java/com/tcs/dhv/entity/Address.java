package com.tcs.dhv.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;


@Entity
@NoArgsConstructor
@Setter
@Getter
@ToString
public class Address {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.NONE)
    private Long id;

    @NonNull
    private String name;

    private String line1;

    private String line2;

    @NonNull
    private String building;

    @NonNull
    private String apartment;

    @NonNull
    private  String city;

    @NonNull
    private String postalCode;

    @NonNull
    private Double longitude;

    @NonNull
    private Double latitude;

    public Address(@NonNull String name, @NonNull String building,
                   @NonNull String apartment, @NonNull String city, @NonNull String postalCode) {
        this.name = name;
        this.building = building;
        this.apartment = apartment;
        this.city = city;
        this.postalCode = postalCode;
    }
}
