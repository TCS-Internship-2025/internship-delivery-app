package com.tcs.dhv.domain.dto;

import com.tcs.dhv.domain.entity.Address;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Address request")
public record AddressDto(
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
    public static AddressDto fromEntity(final Address address) {
        return new AddressDto(
            address.getLine1(),
            address.getLine2(),
            address.getBuilding(),
            address.getApartment(),
            address.getCity(),
            address.getPostalCode(),
            address.getCountry(),
            address.getLatitude(),
            address.getLongitude()
        );
    }

    public Address toEntity() {
        return Address.builder()
            .line1(line1)
            .line2(line2)
            .building(building)
            .apartment(apartment)
            .city(city)
            .postalCode(postalCode)
            .country(country)
            .latitude(latitude)
            .longitude(longitude)
            .build();
    }

    public void updateEntity(final Address address) {
        if (line1 != null) address.setLine1(line1);
        if (line2 != null) address.setLine2(line2);
        if (building != null) address.setBuilding(building);
        if (apartment != null) address.setApartment(apartment);
        if (city != null) address.setCity(city);
        if (postalCode != null) address.setPostalCode(postalCode);
        if (country != null) address.setCountry(country);
        if (latitude != null) address.setLatitude(latitude);
        if (longitude != null) address.setLongitude(longitude);
    }
}