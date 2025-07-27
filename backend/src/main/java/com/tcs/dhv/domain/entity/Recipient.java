package com.tcs.dhv.domain.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Setter
@Getter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "recipients")
@Entity
public class Recipient {

    @Id
    @Setter(AccessLevel.NONE)
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull
    private String name;

    @NotNull
    @Column(unique = true)
    private String email;

    private String phone;

    private LocalDate birthDate;

    @NotNull
    @OneToOne
    @JoinColumn(name = "address_id",nullable = false)
    private Address address;


}
