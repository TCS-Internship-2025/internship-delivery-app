package com.tcs.dhv.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;


@Entity
@Setter
@Getter
@ToString
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.NONE)
    private Long id;

    @NonNull
    private String name;

    @NonNull
    private String email;

    @NonNull
    private String password;

    @NonNull
    private String phone;

    @NonNull
    private Long addressId;

    @NonNull
    private LocalDateTime createdAt;

    @NonNull
    private Boolean isVerified = false;


    public User(@NonNull String name, @NonNull String email,
                @NonNull String password, @NonNull String phone, @NonNull Long addressId) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.addressId = addressId;
        createdAt = LocalDateTime.now();
    }
}
