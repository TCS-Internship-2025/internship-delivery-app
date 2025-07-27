package com.tcs.dhv.domain.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;


@Setter
@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "users")
@Entity
public class User {

    @Id
    @Setter(AccessLevel.NONE)
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull
    private String name;

    @NotNull
    @Column(unique = true)
    private String email;

    @NotNull
    private String password;

    private String phone;

    @OneToOne
    @JoinColumn(name = "address_id")
    private Address address;

    @NotNull
    @CreationTimestamp
    private LocalDateTime createdAt;

    @NotNull
    @Builder.Default
    private Boolean isVerified = false;


}
