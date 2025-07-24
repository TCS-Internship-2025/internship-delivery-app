package com.tcs.dhv.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;
import java.util.UUID;


@Entity
@Setter
@Getter
@ToString
@NoArgsConstructor
@RequiredArgsConstructor
public class User {

    @Id
    @Setter(AccessLevel.NONE)
    private UUID id;

    @NonNull
    private String name;

    @NonNull
    @Column(unique = true)
    private String email;

    @NonNull
    private String password;

    //not required
    private String phone;

    @NonNull
    @Column(name = "Address_id")
    private UUID addressId;

    @NonNull
    @Column(name = "Created_at")
    private OffsetDateTime createdAt; //default in db

    @NonNull
    @Column(name = "is_verified")
    private Boolean isVerified = false;


    public User(@NonNull String name, @NonNull String email,
                @NonNull String password, String phone, @NonNull UUID addressId) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone; // can be null
        this.addressId = addressId;
    }
}
