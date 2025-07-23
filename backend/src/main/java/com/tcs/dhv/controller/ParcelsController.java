package com.tcs.dhv.controller;

import com.tcs.dhv.entity.Parcel;
import com.tcs.dhv.entity.User;
import com.tcs.dhv.service.ParcelService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/parcels")
@RequiredArgsConstructor
@Slf4j
// @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
public class ParcelsController {

    private final ParcelService parcelService;

    // TODO: Change the return type to ResponseEntity<ParcelResponse> and parcelCreate param to ParcelCreate
    @PostMapping
    public ResponseEntity<Parcel> createParcel(@RequestBody Parcel parcelCreate, @AuthenticationPrincipal User currentUser) { // assuming User implements UserDetails and for the rest too
        log.info("Creating parcel request received from user: {}", currentUser.getEmail());

        Parcel parcelResponse = parcelService.createParcel(parcelCreate, currentUser);

        log.info("Parcel created successfully with ID: {} for user: {}",
                parcelResponse.getId(), currentUser.getEmail());

        return ResponseEntity.status(HttpStatus.CREATED).body(parcelResponse);
    }

    // TODO: Change the return type to ResponseEntity<Page<ParcelResponse>>
    @GetMapping
    public ResponseEntity<Page<Parcel>> getUserParcels(Pageable pageable, @AuthenticationPrincipal User currentUser) {
        log.info("Retrieving parcels for user: {} with pagination: page={}, size={}",
                currentUser.getEmail(), pageable.getPageNumber(), pageable.getPageSize());

        Page<Parcel> parcelPage = parcelService.getUserParcels(currentUser.getId(), pageable);

        log.info("Retrieved {} parcels for user: {}", parcelPage.getContent().size(), currentUser.getEmail());
        return ResponseEntity.ok(parcelPage);
    }

    // TODO: Change the return type to ResponseEntity<ParcelResponse>
    @GetMapping("/{id}")
    public ResponseEntity<Parcel> getParcel(@PathVariable Long id, @AuthenticationPrincipal User currentUser) {
        log.info("Retrieving parcel with ID: {} for user: {}", id, currentUser.getEmail());

        Parcel parcel = parcelService.getParcel(id);

        if (!parcel.getSenderId().equals(currentUser.getId())) {
            log.warn("User {} attempted to access parcel {} without permission",
                    currentUser.getEmail(), id);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(parcel);
    }

    // TODO: Change the return type to ResponseEntity<ParcelResponse> and parcelUpdates param to ParcelUpdate
    @PutMapping("/{id}")
    public ResponseEntity<Parcel> updateParcel(@PathVariable Long id, @RequestBody Parcel parcelUpdates, @AuthenticationPrincipal User currentUser) {
        log.info("Updating parcel with ID: {} for user: {}", id, currentUser.getEmail());

        Parcel updatedParcel = parcelService.updateParcel(id, parcelUpdates, currentUser);

        return ResponseEntity.ok(updatedParcel);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteParcel(@PathVariable Long id, @AuthenticationPrincipal User currentUser) {
        log.info("Deleting parcel with ID: {} for user: {}", id, currentUser.getEmail());

        parcelService.deleteParcel(id, currentUser);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/status")
    public void /* ResponseEntity<ParcelStatusResponse> */ getParcelStatus(@PathVariable Long id) {
        // return parcelsService.getParcelStatus(id);
    }
}
