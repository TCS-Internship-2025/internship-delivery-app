package com.tcs.dhv.domain.entity;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.UUID;


@Setter
@Getter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "addresses")
@Entity
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
    private String city;

    @NotNull
    @Builder.Default
    private String country = "Hungary";

    @NotNull
    private String postalCode;

    private Double longitude;
    private Double latitude;
}
