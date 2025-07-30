package com.tcs.dhv.controller;

import com.tcs.dhv.domain.dto.ApiErrorResponse;
import com.tcs.dhv.domain.dto.ParcelDto;
import com.tcs.dhv.service.ParcelService;
import io.swagger.v3.oas.annotations.Operation;
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

@ApiResponses({
    @ApiResponse(responseCode = "401", description = "Authentication required",
        content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiErrorResponse.class))),
    @ApiResponse(responseCode = "403", description = "Access forbidden",
        content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiErrorResponse.class))),
    @ApiResponse(responseCode = "500", description = "Internal server error",
        content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiErrorResponse.class)))
})
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/parcels")
@RestController
@SecurityRequirement(name = "Bearer Authentication")
public class ParcelsController {

    private final ParcelService parcelService;

    @Operation(summary = "Create parcel", description = "Create a new parcel",
    requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
        description = "Parcel creation request",
        required = true,
        content = @Content(mediaType = "application/json",
            schema = @Schema(implementation = ParcelDto.class),
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
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Parcel created successfully",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = ParcelDto.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input data",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiErrorResponse.class))),
            @ApiResponse(responseCode = "422", description = "Validation failed",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    @PostMapping
    public ResponseEntity<ParcelDto> createParcel(
        @Valid @RequestBody final ParcelDto parcelDto,
        final Authentication authentication
    ) {
        log.info("Creating parcel request received from user: {}", authentication.getName());

        final var parcelResponse = parcelService.createParcel(parcelDto, authentication.getName());

        log.info("Parcel created successfully with ID: {} for user: {}", parcelResponse.id(), authentication.getName());

        return ResponseEntity.status(HttpStatus.CREATED).body(parcelResponse);
    }

    @Operation(summary = "Get user's every parcels", description = "Get all of the parcels of the user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Parcels retrieved successfully",
            content = @Content(schema = @Schema(implementation = ParcelDto.class)))
    })
    @GetMapping
    public ResponseEntity<List<ParcelDto>> getUserParcels(final Authentication authentication) {
        log.info("Retrieving parcels for user: {}", authentication.getName());

        final var parcels = parcelService.getUserParcels(authentication.getName());

        log.info("Retrieved {} parcels for user: {}", parcels.size(), authentication.getName());
        return ResponseEntity.ok(parcels);
    }

    @Operation(summary = "Get 1 parcel", description = "Get a specific parcel by parcel's id")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Parcel retrieved successfully",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = ParcelDto.class))),
        @ApiResponse(responseCode = "404", description = "Parcel not found",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    @GetMapping("/{id}")
    public ResponseEntity<ParcelDto> getParcel(
        @PathVariable final UUID id,
        final Authentication authentication
    ) {
        log.info("Retrieving parcel with ID: {} for user: {}", id, authentication.getName());

        final var parcel = parcelService.getParcel(id, authentication.getName());
        return ResponseEntity.ok(parcel);
    }

    @Operation(summary = "Update parcel", description = "Update a parcel by id",requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
        description = "Parcel creation request",
        required = true,
        content = @Content(mediaType = "application/json",
            schema = @Schema(implementation = ParcelDto.class),
            examples = {
                @ExampleObject(
                    name = "Sample Parcel Request",
                    summary = "Example request body for creating a parcel",
                    value = """
                        {
                            "deliveryType": "PICKUP_POINT",
                            "recipient": {
                                "name": "Ferenc Kiss",
                                "email": "ferenckiss19823010@gmail.com",
                                "phone": "+36309876543",
                                "birthDate": "2000-12-12",
                                "address": {
                                    "line1": "Kossuth street 132",
                                    "line2": "2. floor",
                                    "building": "3A",
                                    "apartment": "12",
                                    "city": "Budapest",
                                    "postalCode": "1117",
                                    "country": "Hungary",
                                    "latitude": 47.15,
                                    "longitude": 18.746
                                }
                            }
                        }
                    """
                )
            }
        )
    ))
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Parcel updated successfully",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = ParcelDto.class))),
        @ApiResponse(responseCode = "404", description = "Parcel not found",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiErrorResponse.class))),
        @ApiResponse(responseCode = "422", description = "Validation failed",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    @PutMapping("/{id}")
    public ResponseEntity<ParcelDto> updateParcel(
        @PathVariable final UUID id,
        @Valid @RequestBody final ParcelDto parcelUpdate,
        final Authentication authentication
    ) {
        log.info("Updating parcel with ID: {} for user: {}", id, authentication.getName());

        final var updatedParcel = parcelService.updateParcel(id, parcelUpdate, authentication.getName());
        return ResponseEntity.ok(updatedParcel);
    }

    @Operation(summary = "Delete parcel", description = "Delete a parcel by id")

    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Parcel deleted successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid parcel ID format",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiErrorResponse.class))),
        @ApiResponse(responseCode = "404", description = "Parcel not found",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiErrorResponse.class)))
    })
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