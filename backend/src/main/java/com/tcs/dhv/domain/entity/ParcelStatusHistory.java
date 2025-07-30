package com.tcs.dhv.domain.entity;

import com.tcs.dhv.domain.enums.ParcelStatus;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;


@Setter
@Getter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "parcel_status_history")
@Entity
public class ParcelStatusHistory {

    @Id
    @Setter(AccessLevel.NONE)
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull
    @ManyToOne
    @Setter(AccessLevel.NONE)
    @JoinColumn(name = "parcel_id")
    private Parcel parcel;

    @NotNull
    @Setter(AccessLevel.NONE)
    @Enumerated(EnumType.STRING)
    private ParcelStatus status;

    private String description;

    @Setter(AccessLevel.NONE)
    @CreationTimestamp
    private LocalDateTime timestamp;
}
