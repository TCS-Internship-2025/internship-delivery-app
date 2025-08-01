package com.tcs.dhv.controller;

import com.tcs.dhv.domain.dto.ParcelDto;
import com.tcs.dhv.domain.enums.ParcelStatus;
import com.tcs.dhv.service.EmailService;
import com.tcs.dhv.service.ParcelService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/parcels")
@RestController
public class ParcelsController {

    private final ParcelService parcelService;
    private final EmailService emailService;



    @PostMapping
    public ResponseEntity<ParcelDto> createParcel(
        @Valid @RequestBody final ParcelDto parcelDto,
        final Authentication authentication
    ) {
        log.info("Creating parcel request received from user: {}", authentication.getName());

        final var parcelResponse = parcelService.createParcel(parcelDto, authentication.getName());

        log.info("Parcel created successfully with ID: {} for user: {}", parcelResponse.id(), authentication.getName());

        emailService.sendShipmentCreationEmail(parcelResponse.recipient().email(), parcelResponse.trackingCode());

        log.info("Parcel creation email sent to email: {}", parcelResponse.recipient().email());

        return ResponseEntity.status(HttpStatus.CREATED).body(parcelResponse);
    }

    @GetMapping
    public ResponseEntity<List<ParcelDto>> getUserParcels(final Authentication authentication) {
        log.info("Retrieving parcels for user: {}", authentication.getName());

        final var parcels = parcelService.getUserParcels(authentication.getName());

        log.info("Retrieved {} parcels for user: {}", parcels.size(), authentication.getName());
        return ResponseEntity.ok(parcels);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ParcelDto> getParcel(
        @PathVariable final UUID id,
        final Authentication authentication
    ) {
        log.info("Retrieving parcel with ID: {} for user: {}", id, authentication.getName());

        final var parcel = parcelService.getParcel(id, authentication.getName());
        return ResponseEntity.ok(parcel);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ParcelDto> updateParcel(
        @PathVariable final UUID id,
        @Valid @RequestBody final ParcelDto parcelUpdate,
        final Authentication authentication
    ) {
        log.info("Updating parcel with ID: {} for user: {}", id, authentication.getName());

        final var updatedParcel = parcelService.updateParcel(id, parcelUpdate, authentication.getName());

        if(updatedParcel.currentStatus().equals(ParcelStatus.DELIVERED.toString())){
            emailService.sendDeliveryCompleteEmail(updatedParcel.recipient().email(), updatedParcel.trackingCode());
            log.info("Delivery completion email sent to email: {}", updatedParcel.recipient().email());
        }
        return ResponseEntity.ok(updatedParcel);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteParcel(
        @PathVariable final UUID id,
        final Authentication authentication
    ) {
        log.info("Deleting parcel with ID: {} for user: {}", id, authentication.getName());

        parcelService.deleteParcel(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
