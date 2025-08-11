package com.tcs.dhv.domain.dto;

import com.tcs.dhv.domain.entity.Address;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.io.Serializable;

@Schema(description = "Address request")
public record AddressDto(
    @Size(max = 255, message = "Line 1 cannot exceed {max} characters")
    String line1,

    @Size(max = 255, message = "Line 2 cannot exceed {max} characters")
    String line2,

    @Size(max = 100, message = "Building cannot exceed {max} characters")
    String building,

    @Size(max = 50, message = "Apartment cannot exceed {max} characters")
    String apartment,

    @Size(max = 100, message = "City cannot exceed {max} characters")
    String city,

    @Pattern(regexp = "^\\d{4}$", message = "Hungarian postal code must be 4 digits")
    String postalCode,

    @Size(max = 100, message = "Country cannot exceed {max} characters")
    String country,

    // Source: https://www.latlong.net/place/budapest-hungary-23565.html
    // Ranges are an approximation
    @DecimalMin(value = "47.0", message = "Latitude must be between 47.0 and 48.0")
    @DecimalMax(value = "48.0", message = "Latitude must be between 47.0 and 48.0")
    Double latitude,

    @DecimalMin(value = "18.0", message = "Longitude must be between 18.0 and 20.0")
    @DecimalMax(value = "20.0", message = "Longitude must be between 18.0 and 20.0")
    Double longitude
) implements Serializable {
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
            .country(country)
            .postalCode(postalCode)
            .longitude(longitude)
            .latitude(latitude)
            .build();
    }

    public void updateEntity(final Address address) {
        if (line1 != null && !line1.isBlank()) address.setLine1(line1);
        if (line2 != null && !line2.isBlank()) address.setLine2(line2);
        if (building != null && !building.isBlank()) address.setBuilding(building);
        if (apartment != null && !apartment.isBlank()) address.setApartment(apartment);
        if (city != null && !city.isBlank()) address.setCity(city);
        if (postalCode != null && !postalCode.isBlank()) address.setPostalCode(postalCode);
        if (country != null && !country.isBlank()) address.setCountry(country);
        if (latitude != null) address.setLatitude(latitude);
        if (longitude != null) address.setLongitude(longitude);
    }
}
