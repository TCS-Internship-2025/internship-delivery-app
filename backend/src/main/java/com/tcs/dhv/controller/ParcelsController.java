package com.tcs.dhv.controller;

import com.tcs.dhv.domain.dto.AddressChangeDto;
import com.tcs.dhv.domain.dto.ParcelDto;
import com.tcs.dhv.service.AddressChangeService;
import com.tcs.dhv.service.EmailService;
import com.tcs.dhv.service.ParcelService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
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

@Tag(name = "Parcels", description = "Parcels controller operations")

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/parcels")
@RestController
@SecurityRequirement(name = "Bearer Authentication")
public class ParcelsController {

    private final ParcelService parcelService;
    private final EmailService emailService;
    private final ParcelStatusHistoryService  parcelStatusHistoryService;
    private final AddressChangeService addressChangeService;

    @Operation(summary = "Create parcel", description = "Create a new parcel",
    requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
        description = "Parcel creation request",
        required = true,
        content = @Content(schema = @Schema(implementation = ParcelDto.class),
            examples = {
                @ExampleObject(
                    name = "Sample Parcel Request",
                    summary = "Example request body for creating a parcel",
                    value = """
                        {
                          "recipient": {
                            "name": "Ferenc Kiss",
                            "email": "ferenckiss19823010@gmail.com",
                            "phone": "+36309876543",
                            "birthDate": "2000-12-12",
                            "address": {
                              "line1": "Kossuth street 12",
                              "line2": "2. floor",
                              "building": "3A",
                              "apartment": "12",
                              "city": "Budapest",
                              "postalCode": "1117",
                              "country": "Hungary",
                              "latitude": 47.15,
                              "longitude": 18.746
                            }
                          },
                          "deliveryType": "PICKUP_POINT",
                          "paymentType": "SENDER_PAYS"
                        }
                    """
                )
            }
        )
    )
    )
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

    @Operation(summary = "Get user's every parcels", description = "Get all of the parcels of the user")
    @GetMapping
    public ResponseEntity<List<ParcelDto>> getUserParcels(final Authentication authentication) {
        log.info("Retrieving parcels for user: {}", authentication.getName());

        final var parcels = parcelService.getUserParcels(UUID.fromString(authentication.getName()));
        log.info("Retrieved {} parcels for user: {}", parcels.size(), authentication.getName());

        return ResponseEntity.ok(parcels);
    }

    @Operation(summary = "Get 1 parcel", description = "Get a specific parcel by parcel's id")
    @GetMapping("/{id}")
    public ResponseEntity<ParcelDto> getParcel(
        @PathVariable final UUID id,
        final Authentication authentication
    ) {
        log.info("Retrieving parcel with ID: {} for user: {}", id, authentication.getName());

        final var parcel = parcelService.getParcel(id, UUID.fromString(authentication.getName()));

        return ResponseEntity.ok(parcel);
    }

    @Operation(summary = "Delete parcel", description = "Delete a parcel by parcel's id")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteParcel(
        @PathVariable final UUID id,
        final Authentication authentication
    ) {
        log.info("Deleting parcel with ID: {} for user: {}", id, authentication.getName());

        parcelService.deleteParcel(id, UUID.fromString(authentication.getName()));

        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Update parcel address", description = "Update a parcel's delivery address by parcel's id")
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
