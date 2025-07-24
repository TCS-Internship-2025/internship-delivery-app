package com.tcs.dhv.entity;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;




import java.util.UUID;


@Entity
@NoArgsConstructor
@RequiredArgsConstructor
@Setter
@Getter
@ToString
@Table(name = "addresses")
public class Address {


    @Id
    @Setter(AccessLevel.NONE)
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;


    @NotNull
    private String line1;

    private String line2;

    private String building;
    private String apartment;

    @NotNull
    private  String city;

    @NotNull
    private String country;

    @NotNull
    private String postalCode;

    private Double longitude;
    private Double latitude;

    public Address(
            @NotNull String line1, String line2 ,String building, String apartment,
            @NotNull String city, @NotNull String postalCode
    ){

        this.line1 = line1;
        this.line2 = line2;
        this.building = building;
        this.apartment = apartment;
        this.city = city;
        this.country = "Hungary";
        this.postalCode = postalCode;
    }
}
