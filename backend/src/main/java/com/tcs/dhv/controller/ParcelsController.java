package com.tcs.dhv.controller;

import com.tcs.dhv.domain.dto.ParcelRequest;
import com.tcs.dhv.domain.dto.ParcelResponse;
import com.tcs.dhv.domain.dto.ParcelUpdate;
import com.tcs.dhv.domain.entity.User;
import com.tcs.dhv.service.ParcelService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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

    @PostMapping
    public ResponseEntity<ParcelResponse> createParcel(
        @Valid @RequestBody final ParcelRequest parcelRequest,
        @AuthenticationPrincipal final User currentUser
    ) {
        log.info("Creating parcel request received from user: {}", currentUser.getEmail());

        final var parcelResponse = parcelService.createParcel(parcelRequest, currentUser);

        log.info("Parcel created successfully with ID: {} for user: {}", parcelResponse.id(), currentUser.getEmail());

        return ResponseEntity.status(HttpStatus.CREATED).body(parcelResponse);
    }

    @GetMapping
    public ResponseEntity<List<ParcelResponse>> getUserParcels(@AuthenticationPrincipal final User currentUser) {
        log.info("Retrieving parcels for user: {}", currentUser.getEmail());

        final var parcels = parcelService.getUserParcels(currentUser.getId());

        log.info("Retrieved {} parcels for user: {}", parcels.size(), currentUser.getEmail());
        return ResponseEntity.ok(parcels);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ParcelResponse> getParcel(
        @PathVariable final UUID id,
        @AuthenticationPrincipal final User currentUser
    ) {
        log.info("Retrieving parcel with ID: {} for user: {}", id, currentUser.getEmail());

        final var parcel = parcelService.getParcel(id, currentUser);
        return ResponseEntity.ok(parcel);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ParcelResponse> updateParcel(
        @PathVariable final UUID id,
        @Valid @RequestBody final ParcelUpdate parcelUpdate,
        @AuthenticationPrincipal final User currentUser
    ) {
        log.info("Updating parcel with ID: {} for user: {}", id, currentUser.getEmail());

        final var updatedParcel = parcelService.updateParcel(id, parcelUpdate, currentUser);
        return ResponseEntity.ok(updatedParcel);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteParcel(
        @PathVariable final UUID id,
        @AuthenticationPrincipal final User currentUser
    ) {
        log.info("Deleting parcel with ID: {} for user: {}", id, currentUser.getEmail());

        parcelService.deleteParcel(id, currentUser);
        return ResponseEntity.noContent().build();
    }
}
