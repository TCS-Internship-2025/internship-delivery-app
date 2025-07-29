package com.tcs.dhv.controller;

import com.tcs.dhv.domain.dto.ApiErrorResponse;
import com.tcs.dhv.domain.dto.ParcelRequest;
import com.tcs.dhv.domain.dto.ParcelResponse;
import com.tcs.dhv.domain.dto.ParcelUpdate;
import com.tcs.dhv.domain.entity.User;

import com.tcs.dhv.service.ParcelService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
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

    @Operation(summary = "Create parcel", description = "Create a new parcel")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Parcel created successfully",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = ParcelResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input data",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiErrorResponse.class))),
            @ApiResponse(responseCode = "422", description = "Validation failed",
                content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiErrorResponse.class)))
    })
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

    @Operation(summary = "Get user's every parcels", description = "Get all of the parcels of the user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Parcels retrieved successfully",
            content = @Content(schema = @Schema(implementation = ParcelResponse.class)))
    })
    @GetMapping
    public ResponseEntity<List<ParcelResponse>> getUserParcels(@AuthenticationPrincipal final User currentUser) {
        log.info("Retrieving parcels for user: {}", currentUser.getEmail());

        final var parcels = parcelService.getUserParcels(currentUser.getId());

        log.info("Retrieved {} parcels for user: {}", parcels.size(), currentUser.getEmail());
        return ResponseEntity.ok(parcels);
    }

    @Operation(summary = "Get 1 parcel", description = "Get a specific parcel by parcel's id")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Parcel retrieved successfully",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = ParcelResponse.class))),
        @ApiResponse(responseCode = "404", description = "Parcel not found",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    @GetMapping("/{id}")
    public ResponseEntity<ParcelResponse> getParcel(
        @PathVariable final UUID id,
        @AuthenticationPrincipal final User currentUser
    ) {
        log.info("Retrieving parcel with ID: {} for user: {}", id, currentUser.getEmail());

        final var parcel = parcelService.getParcel(id, currentUser);
        return ResponseEntity.ok(parcel);
    }

    @Operation(summary = "Update parcel", description = "Update a parcel by id")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Parcel updated successfully",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = ParcelResponse.class))),
        @ApiResponse(responseCode = "404", description = "Parcel not found",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiErrorResponse.class))),
        @ApiResponse(responseCode = "422", description = "Validation failed",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiErrorResponse.class)))
    })
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
        @AuthenticationPrincipal final User currentUser
    ) {
        log.info("Deleting parcel with ID: {} for user: {}", id, currentUser.getEmail());

        parcelService.deleteParcel(id, currentUser);
        return ResponseEntity.noContent().build();
    }
}