package com.tcs.dhv.controller;

import com.tcs.dhv.domain.dto.AddressChangeDto;
import com.tcs.dhv.domain.dto.AddressDto;
import com.tcs.dhv.domain.dto.ApiErrorResponse;
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

import static com.tcs.dhv.config.openapi.SchemaConstants.PARCEL_ID_DESC;
import static com.tcs.dhv.config.openapi.SchemaConstants.PARCEL_ID_EX;

@Tag(name = "Parcels", description = "Parcel management operations for DHV delivery service. Handles parcel creation, tracking, status management and address modifications.")
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
        description = """
            Create (send) a new parcel for delivery through the DHV service.
            
            The system will automatically:
            - Generate a unique tracking code (format: HU + 10 digits + 2 letters)
            - Set initial status to CREATED
            - Create recipient record with provided details
            - Send email confirmation to both sender and recipient
            - Log the creation in parcel status history
            
            **Note:** Recipients are created fresh for each parcel to preserve exact sender input at time of creation.""",
        requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "Parcel creation request",
            required = true,
            content = @Content(
                schema = @Schema(implementation = ParcelDto.class),
                examples = {
                    @ExampleObject(
                        name = "homeDelivery",
                        summary = "Create parcel for home delivery",
                        description = "Example of creating a parcel to be delivered to a home address with sender paying",
                        value = """
                            {
                                "address": {
                                    "line1": "Bartók Béla út 42",
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
                    ),
                    @ExampleObject(
                        name = "pickupPoint",
                        summary = "Create parcel for pickup point delivery",
                        description = "Example of creating a parcel to be delivered to a pickup point with recipient paying",
                        value = """
                            {
                                "address": {
                                    "line1": "Váci út 1-3",
                                    "line2": "WestEnd City Center",
                                    "building": "Main Building",
                                    "apartment": null,
                                    "city": "Budapest",
                                    "postalCode": "1062",
                                    "country": "Hungary",
                                    "latitude": 47.5108,
                                    "longitude": 19.0573
                                },
                                "recipient": {
                                    "name": "Anna Kovács",
                                    "email": "anna.kovacs@example.hu",
                                    "phone": "+36701234567",
                                    "birthDate": "1992-03-15"
                                },
                                "paymentType": "RECIPIENT_PAYS",
                                "deliveryType": "PICKUP_POINT"
                            }
                        """
                    )
                }

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
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Invalid request data - validation errors",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ApiErrorResponse.class),
                examples = @ExampleObject(
                    value = """
                        {
                            "status": 400,
                            "message": "Validation failed",
                            "timestamp": "2025-08-07T14:21:44.393952Z",
                            "errors": [
                                {
                                    "field": "recipient.email",
                                    "message": "must be a well-formed email address"
                                },
                                {
                                    "field": "address.postalCode",
                                    "message": "must not be blank"
                                }
                            ]
                        }
                    """
                )
            )
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Unauthorized - invalid or missing authentication token",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ApiErrorResponse.class),
                examples = @ExampleObject(
                    value = """
                        {
                            "status": 401,
                            "message": "Unauthorized",
                            "timestamp": "2025-08-07T14:21:44.393952Z",
                            "errors": []
                        }
                    """
                )
            )
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ApiErrorResponse.class),
                examples = @ExampleObject(
                    value = """
                        {
                            "status": 500,
                            "message": "Internal server error",
                            "timestamp": "2025-08-07T14:21:44.393952Z",
                            "errors": []
                        }
                    """
                )
            )
        )
    })
    @PostMapping
    public ResponseEntity<ParcelDto> createParcel(
        @Valid @RequestBody final ParcelDto parcelDto,
        @Parameter(hidden = true) final Authentication authentication
    ) {
        final var parcel = parcelService.createParcel(parcelDto, UUID.fromString(authentication.getName()));

        return ResponseEntity.status(HttpStatus.CREATED).body(parcel);
    }

    @Operation(
        summary = "Get user's parcels", 
        description = """
            Retrieve all parcels sent by the authenticated user.
            
            Returns a list including:
            - All parcel details (tracking code, addresses, recipients)
            - Current delivery status and timestamps
            - Payment and delivery type information
            
            Results are sorted by creation date (newest first)."""
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
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Unauthorized - invalid or missing authentication token",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ApiErrorResponse.class)
            )
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ApiErrorResponse.class)
            )
        )
    })
    @GetMapping
    public ResponseEntity<List<ParcelDto>> getUserParcels(
        @Parameter(hidden = true) final Authentication authentication
    ) {
        final var parcels = parcelService.getUserParcels(UUID.fromString(authentication.getName()));

        return ResponseEntity.ok(parcels);
    }

    @Operation(
        summary = "Get parcel by ID", 
        description = """
            Retrieve detailed information about a specific parcel by its unique ID.
            
            **Security:** Only the parcel sender (owner) can access their parcel details.
            Includes complete information about:
            - Delivery address and coordinates
            - Recipient contact information
            - Current status and tracking code
            - Creation and modification timestamps
            
            **Performance:** This endpoint is cached for improved response times."""
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
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Unauthorized - invalid or missing authentication token",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ApiErrorResponse.class)
            )
        ),
        @ApiResponse(
            responseCode = "403",
            description = "Forbidden - user cannot access this parcel",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ApiErrorResponse.class),
                examples = @ExampleObject(
                    value = """
                        {
                            "status": 403,
                            "message": "Access denied",
                            "timestamp": "2025-08-07T14:21:44.393952Z",
                            "errors": []
                        }
                    """
                )
            )
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Parcel not found",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ApiErrorResponse.class),
                examples = @ExampleObject(
                    value = """
                        {
                            "status": 404,
                            "message": "Parcel not found with ID: c6b578b8-7a72-4628-9a46-66c950f08c05",
                            "timestamp": "2025-08-07T14:21:44.393952Z",
                            "errors": []
                        }
                    """
                )
            )
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ApiErrorResponse.class)
            )
        )
    })
    @GetMapping("/{id}")
    public ResponseEntity<ParcelDto> getParcel(
        @Parameter(description = PARCEL_ID_DESC, required = true, example = PARCEL_ID_EX)
        @PathVariable final UUID id,
        @Parameter(hidden = true) final Authentication authentication
    ) {
        final var parcel = parcelService.getParcel(id, UUID.fromString(authentication.getName()));

        return ResponseEntity.ok(parcel);
    }

    @Operation(
        summary = "Delete parcel", 
        description = """
            Permanently delete a parcel from the system.
            
            **Security:** Only the parcel sender (owner) can delete their own parcels.
            **Warning:** This action is irreversible and will:
            - Remove all parcel data including status history
            - Delete associated recipient and address records
            - Invalidate the tracking code
            
            **Performance:** Cache entries are automatically cleared upon deletion."""
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "204",
            description = "Parcel deleted successfully"
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Unauthorized - invalid or missing authentication token",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ApiErrorResponse.class)
            )
        ),
        @ApiResponse(
            responseCode = "403",
            description = "Forbidden - user cannot delete this parcel",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ApiErrorResponse.class),
                examples = @ExampleObject(
                    value = """
                        {
                            "status": 403,
                            "message": "Access denied",
                            "timestamp": "2025-08-07T14:21:44.393952Z",
                            "errors": []
                        }
                    """
                )
            )
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Parcel not found",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ApiErrorResponse.class),
                examples = @ExampleObject(
                    value = """
                        {
                            "status": 404,
                            "message": "Parcel not found with ID: c6b578b8-7a72-4628-9a46-66c950f08c05",
                            "timestamp": "2025-08-07T14:21:44.393952Z",
                            "errors": []
                        }
                    """
                )
            )
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ApiErrorResponse.class)
            )
        )
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteParcel(
        @Parameter(description = PARCEL_ID_DESC, required = true, example = PARCEL_ID_EX)
        @PathVariable final UUID id,
        @Parameter(hidden = true) final Authentication authentication
    ) {
        parcelService.deleteParcel(id, UUID.fromString(authentication.getName()));

        return ResponseEntity.noContent().build();
    }

    @Operation(
        summary = "Change parcel address", 
        description = """
            Update a parcel's delivery address and delivery type during transit.
            
            **Business Rules:**
            - Only the parcel sender can request address changes
            - Some delivery statuses may prevent address modification
            
            **Process:**
            - Validates new address information
            - Updates delivery coordinates if provided
            - Sends notification email to recipient about address change
            - Logs the change in parcel status history""",
        requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "Address change request with new delivery details",
            required = true,
            content = @Content(
                schema = @Schema(implementation = AddressChangeDto.class),
                examples = {
                    @ExampleObject(
                        name = "homeAddressChange",
                        summary = "Change to home delivery address",
                        description = "Example of changing parcel delivery address to a home address",
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
                    ),
                    @ExampleObject(
                        name = "pickupPointChange",
                        summary = "Change to pickup point delivery",
                        description = "Example of changing parcel delivery from home to pickup point",
                        value = """
                            {
                              "newAddress": {
                                "line1": "Kossuth Lajos tér 1-3",
                                "line2": "Hungarian Parliament Building area",
                                "building": "Pickup Point Hub",
                                "apartment": null,
                                "city": "Budapest",
                                "postalCode": "1055",
                                "country": "Hungary",
                                "latitude": 47.5072,
                                "longitude": 19.0458
                              },
                              "deliveryType": "PICKUP_POINT",
                              "requestReason": "Recipient prefers pickup point for convenience"
                            }
                        """
                    )
                }
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
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Invalid request data - validation errors",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ApiErrorResponse.class),
                examples = @ExampleObject(
                    value = """
                        {
                            "status": 400,
                            "message": "Validation failed",
                            "timestamp": "2025-08-07T14:21:44.393952Z",
                            "errors": [
                                {
                                    "field": "newAddress.city",
                                    "message": "must not be blank"
                                }
                            ]
                        }
                    """
                )
            )
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Unauthorized - invalid or missing authentication token",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ApiErrorResponse.class)
            )
        ),
        @ApiResponse(
            responseCode = "403",
            description = "Forbidden - user cannot modify this parcel",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ApiErrorResponse.class),
                examples = @ExampleObject(
                    value = """
                        {
                            "status": 403,
                            "message": "Access denied",
                            "timestamp": "2025-08-07T14:21:44.393952Z",
                            "errors": []
                        }
                    """
                )
            )
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Parcel not found",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ApiErrorResponse.class),
                examples = @ExampleObject(
                    value = """
                        {
                            "status": 404,
                            "message": "Parcel not found with ID: c6b578b8-7a72-4628-9a46-66c950f08c05",
                            "timestamp": "2025-08-07T14:21:44.393952Z",
                            "errors": []
                        }
                    """
                )
            )
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ApiErrorResponse.class)
            )
        )
    })
    @PutMapping("/{id}/address")
    public ResponseEntity<AddressDto> changeAddress(
        @Parameter(description = PARCEL_ID_DESC, required = true, example = PARCEL_ID_EX)
        @PathVariable final UUID id,
        @Valid @RequestBody final AddressChangeDto requestDto,
        @Parameter(hidden = true) final Authentication authentication
    ) {
        final var updatedAddress = addressChangeService.changeAddress(id, requestDto, UUID.fromString(authentication.getName()));

        return ResponseEntity.ok(updatedAddress);
    }
}
