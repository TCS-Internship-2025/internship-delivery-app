package com.tcs.dhv.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;

import java.util.UUID;


@Entity
@NoArgsConstructor
@RequiredArgsConstructor
@Setter
@Getter
@ToString
public class Address {


    @Id
    @Setter(AccessLevel.NONE)
    private UUID id;


    private String name;

    @NonNull
    private String line1;

    private String line2;

    private String building;
    private String apartment;

    @NonNull
    private  String city;

    @NonNull
    private String country;

    @NonNull
    private String postalCode;

    private Double longitude;
    private Double latitude;

    public Address(String name,@NonNull String line1, String line2 ,
                    String building, String apartment,
                   @NonNull String city, @NonNull String country, @NonNull String postalCode) {
        this.name = name;
        this.line1 = line1;
        this.line2 = line2;
        this.building = building;
        this.apartment = apartment;
        this.city = city;
        this.country = country;
        this.postalCode = postalCode;
    }
}
