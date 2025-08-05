package com.tcs.dhv.controller;

import com.tcs.dhv.domain.dto.AddressChangeDto;
import com.tcs.dhv.domain.dto.ParcelDto;
import com.tcs.dhv.service.AddressChangeService;
import com.tcs.dhv.service.EmailService;
import com.tcs.dhv.service.ParcelService;
import com.tcs.dhv.service.ParcelStatusHistoryService;
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
    private final ParcelStatusHistoryService  parcelStatusHistoryService;
    private final AddressChangeService addressChangeService;

    @PostMapping
    public ResponseEntity<ParcelDto> createParcel(
        @Valid @RequestBody final ParcelDto parcelDto,
        final Authentication authentication
    ) {
        log.info("Creating parcel request received from user: {}", authentication.getName());

        final var parcel = parcelService.createParcel(parcelDto, UUID.fromString(authentication.getName()));
        log.info("Parcel created successfully with ID: {} for user: {}", parcel.id(), authentication.getName());

        return ResponseEntity.status(HttpStatus.CREATED).body(parcel);
    }

    @GetMapping
    public ResponseEntity<List<ParcelDto>> getUserParcels(final Authentication authentication) {
        log.info("Retrieving parcels for user: {}", authentication.getName());

        final var parcels = parcelService.getUserParcels(UUID.fromString(authentication.getName()));
        log.info("Retrieved {} parcels for user: {}", parcels.size(), authentication.getName());

        return ResponseEntity.ok(parcels);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ParcelDto> getParcel(
        @PathVariable final UUID id,
        final Authentication authentication
    ) {
        log.info("Retrieving parcel with ID: {} for user: {}", id, authentication.getName());

        final var parcel = parcelService.getParcel(id, UUID.fromString(authentication.getName()));

        return ResponseEntity.ok(parcel);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteParcel(
        @PathVariable final UUID id,
        final Authentication authentication
    ) {
        log.info("Deleting parcel with ID: {} for user: {}", id, authentication.getName());

        parcelService.deleteParcel(id, UUID.fromString(authentication.getName()));

        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/address")
    public ResponseEntity<Void> changeAddress(
        @PathVariable final UUID id,
        @Valid @RequestBody final AddressChangeDto requestDto,
        final Authentication authentication
    ) {
        log.info("Changing Address for parcel {} by user: {}", id, authentication.getName());

        addressChangeService.changeAddress(id, requestDto, UUID.fromString(authentication.getName()));

        return ResponseEntity.ok().build();
    }
}
