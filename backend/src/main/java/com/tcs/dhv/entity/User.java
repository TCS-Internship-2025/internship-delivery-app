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
@Table(name = "users")
public class User {

    @Id
    @Setter(AccessLevel.NONE)
    @GeneratedValue(strategy = GenerationType.UUID)
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

    @OneToOne
    @JoinColumn(name = "address_id", nullable = false)
    private Address address;

    @NonNull
    @Column(name = "created_at")
    private OffsetDateTime createdAt; //default in db

    @NonNull
    @Column(name = "is_verified")
    private Boolean isVerified;


    public User(@NonNull String name, @NonNull String email,
                @NonNull String password, String phone,@NonNull Address address) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.address = address;
    }
}
