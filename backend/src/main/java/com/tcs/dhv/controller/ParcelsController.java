package com.tcs.dhv.controller;

import com.tcs.dhv.domain.dto.AddressChangeDto;
import com.tcs.dhv.domain.dto.AddressDto;
import com.tcs.dhv.domain.dto.ParcelDto;
import com.tcs.dhv.service.AddressChangeService;
import com.tcs.dhv.service.ParcelService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
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
    private final AddressChangeService addressChangeService;

    @Operation(
        summary = "Create parcel", 
        description = "Create (send) a new parcel.\n\nThe parcel will be assigned a unique tracking code and initial status.",
        requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "Parcel creation request",
            required = true,
            content = @Content(
                schema = @Schema(implementation = ParcelDto.class),
                examples =
                    @ExampleObject(
                        summary = "Create parcel for home delivery",
                        value = """
                            {
                                "address": {
                                    "line1": "Bartók Béla út",
                                    "line2": "1. emelet",
                                    "building": "C épület",
                                    "apartment": "7",
                                    "city": "Budapest",
                                    "postalCode": "1114",
                                    "country": "Hungary",
                                    "latitude": 47.4750,
                                    "longitude": 19.0478
                                },
                                "recipient": {
                                    "name": "Miklós Tóth",
                                    "email": "miklos.toth@example.com",
                                    "phone": "+36309876543",
                                    "birthDate": "1988-06-22"
                                },
                                "paymentType": "SENDER_PAYS",
                                "deliveryType": "HOME"
                            }
                        """
                    )

            )
        )
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "201",
            description = "Parcel created successfully",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ParcelDto.class),
                examples = @ExampleObject(
                    value = """
                        {
                            "id": "c6b578b8-7a72-4628-9a46-66c950f08c05",
                            "trackingCode": "HU2606574833TV",
                            "address": {
                                "line1": "Bartók Béla út",
                                "line2": "1. emelet",
                                "building": "C épület",
                                "apartment": "7",
                                "city": "Budapest",
                                "postalCode": "1114",
                                "country": "Hungary",
                                "latitude": 47.475,
                                "longitude": 19.0478
                            },
                            "recipient": {
                                "name": "Miklós Tóth",
                                "email": "miklos.toth@example.com",
                                "phone": "+36309876543",
                                "birthDate": "1988-06-22"
                            },
                            "currentStatus": "CREATED",
                            "deliveryType": "HOME",
                            "paymentType": "SENDER_PAYS",
                            "createdAt": "2025-08-07T14:21:44.393952",
                            "updatedAt": "2025-08-07T14:21:44.393952"
                        }
                    """
                )
            )
        )
    })
    @PostMapping
    public ResponseEntity<ParcelDto> createParcel(
        @Valid @RequestBody final ParcelDto parcelDto,
        final Authentication authentication
    ) {
        final var parcel = parcelService.createParcel(parcelDto, UUID.fromString(authentication.getName()));

        return ResponseEntity.status(HttpStatus.CREATED).body(parcel);
    }

    @Operation(
        summary = "Get user's parcels", 
        description = "Retrieve all parcels belonging to the authenticated user"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "User's parcels retrieved successfully",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ParcelDto.class, type = "array"),
                examples = @ExampleObject(
                    value = """
                    [
                         {
                             "id": "a3ac35b1-78e5-4f4a-bd30-646b8936d4d4",
                             "trackingCode": "HU6651429307ID",
                             "address": {
                                 "line1": "Petőfi Sándor utca",
                                 "line2": "2. lépcsőház",
                                 "building": "A épület",
                                 "apartment": "12",
                                 "city": "Debrecen",
                                 "postalCode": "4032",
                                 "country": "Hungary",
                                 "latitude": 47.5312,
                                 "longitude": 19.4823
                             },
                             "recipient": {
                                 "name": "Erika Szabó",
                                 "email": "erika.szabo@example.hu",
                                 "phone": "+36205556677",
                                 "birthDate": "1972-11-08"
                             },
                             "currentStatus": "CREATED",
                             "deliveryType": "PICKUP_POINT",
                             "paymentType": "RECIPIENT_PAYS",
                             "createdAt": "2025-08-07T14:21:07.59329",
                             "updatedAt": "2025-08-07T14:21:07.575856"
                         },
                         {
                             "id": "c6b578b8-7a72-4628-9a46-66c950f08c05",
                             "trackingCode": "HU2606574833TV",
                             "address": {
                                 "line1": "Bartók Béla út",
                                 "line2": "1. emelet",
                                 "building": "C épület",
                                 "apartment": "7",
                                 "city": "Budapest",
                                 "postalCode": "1114",
                                 "country": "Hungary",
                                 "latitude": 47.475,
                                 "longitude": 19.0478
                             },
                             "recipient": {
                                 "name": "Miklós Tóth",
                                 "email": "miklos.toth@example.com",
                                 "phone": "+36309876543",
                                 "birthDate": "1988-06-22"
                             },
                             "currentStatus": "CREATED",
                             "deliveryType": "HOME",
                             "paymentType": "SENDER_PAYS",
                             "createdAt": "2025-08-07T14:21:44.393952",
                             "updatedAt": "2025-08-07T14:21:44.3796"
                         }
                    ]
                    """
                )
            )
        )
    })
    @GetMapping
    public ResponseEntity<List<ParcelDto>> getUserParcels(final Authentication authentication) {
        final var parcels = parcelService.getUserParcels(UUID.fromString(authentication.getName()));

        return ResponseEntity.ok(parcels);
    }

    @Operation(
        summary = "Get parcel by ID", 
        description = "Retrieve detailed information about a specific parcel by its ID. Only the parcel owner can access this information."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Parcel details retrieved successfully",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ParcelDto.class),
                examples = @ExampleObject(
                    value = """
                        {
                            "id": "c6b578b8-7a72-4628-9a46-66c950f08c05",
                            "trackingCode": "HU2606574833TV",
                            "address": {
                                "line1": "Bartók Béla út",
                                "line2": "1. emelet",
                                "building": "C épület",
                                "apartment": "7",
                                "city": "Budapest",
                                "postalCode": "1114",
                                "country": "Hungary",
                                "latitude": 47.475,
                                "longitude": 19.0478
                            },
                            "recipient": {
                                "name": "Miklós Tóth",
                                "email": "miklos.toth@example.com",
                                "phone": "+36309876543",
                                "birthDate": "1988-06-22"
                            },
                            "currentStatus": "CREATED",
                            "deliveryType": "HOME",
                            "paymentType": "SENDER_PAYS",
                            "createdAt": "2025-08-07T14:21:44.393952",
                            "updatedAt": "2025-08-07T14:21:44.3796"
                        }
                    """
                )
            )
        )
    })
    @GetMapping("/{id}")
    public ResponseEntity<ParcelDto> getParcel(
        @Parameter(description = "Unique identifier of the parcel", required = true, example = "123e4567-e89b-12d3-a456-426614174000")
        @PathVariable final UUID id,
        final Authentication authentication
    ) {
        final var parcel = parcelService.getParcel(id, UUID.fromString(authentication.getName()));

        return ResponseEntity.ok(parcel);
    }

    @Operation(
        summary = "Delete parcel", 
        description = "Permanently delete a parcel by its ID. Only the parcel owner can delete their parcels."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "204",
            description = "Parcel deleted successfully"
        )
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteParcel(
        @Parameter(description = "Unique identifier of the parcel to delete", required = true, example = "123e4567-e89b-12d3-a456-426614174000")
        @PathVariable final UUID id,
        final Authentication authentication
    ) {
        parcelService.deleteParcel(id, UUID.fromString(authentication.getName()));

        return ResponseEntity.noContent().build();
    }

    @Operation(
        summary = "Change parcel address", 
        description = "Update a parcel's delivery address and delivery type.",
        requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "Address change request with new delivery details",
            required = true,
            content = @Content(
                schema = @Schema(implementation = AddressChangeDto.class),
                examples =
                    @ExampleObject(
                        summary = "Update address for home delivery",
                        value = """
                            {
                              "newAddress": {
                                "line1": "Váci út 45",
                                "line2": "3rd floor",
                                "building": "B",
                                "apartment": "301",
                                "city": "Budapest",
                                "postalCode": "1134",
                                "country": "Hungary",
                                "latitude": 47.5316,
                                "longitude": 19.0566
                              },
                              "deliveryType": "HOME",
                              "requestReason": "Recipient moved to new address"
                            }
                        """
                    )
            )
        )
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Address changed successfully",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = AddressDto.class),
                examples = @ExampleObject(
                    value = """
                        {
                            "line1": "Andrássy út 66",
                            "line2": "3. emelet",
                            "building": "A épület",
                            "apartment": "9",
                            "city": "Budapest",
                            "postalCode": "1062",
                            "country": "Hungary",
                            "latitude": 47.5089,
                            "longitude": 19.0657
                        }
                    """
                )
            )
        )
    })
    @PutMapping("/{id}/address")
    public ResponseEntity<AddressDto> changeAddress(
        @Parameter(description = "Unique identifier of the parcel to update", required = true, example = "123e4567-e89b-12d3-a456-426614174000")
        @PathVariable final UUID id,
        @Valid @RequestBody final AddressChangeDto requestDto,
        final Authentication authentication
    ) {
        final var updatedAddress = addressChangeService.changeAddress(id, requestDto, UUID.fromString(authentication.getName()));

        return ResponseEntity.ok(updatedAddress);
    }
}
