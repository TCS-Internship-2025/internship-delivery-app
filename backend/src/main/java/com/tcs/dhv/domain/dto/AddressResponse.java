package com.tcs.dhv.domain.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Address response")
public record AddressResponse(
    @Schema(description = "Primary address line", example = "Kossuth street 12")
    String line1,

    @Schema(description = "Secondary address line", example = "2. floor")
    String line2,

    @Schema(description = "Building number/characters", example = "3A")
    String building,

    @Schema(description = "Apartment number/characters", example = "12")
    String apartment,

    @Schema(description ="City", example = "Budapest")
    String city,

    @Schema(description = "Postal Code", example = "1117")
    String postalCode,

    @Schema(description = "Country", example = "Hungary")
    String country,

    @Schema(description = "Latitude of the location, between 47.0 and 48.0", example = "47.15")
    Double latitude,

    @Schema(description = "Longitude of the location, between 18.0 and 20.0", example = "18.746")
    Double longitude
) {
}
