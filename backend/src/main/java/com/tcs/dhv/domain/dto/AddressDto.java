package com.tcs.dhv.domain.dto;

import com.tcs.dhv.domain.entity.Address;

public record AddressDto(
    String line1,
    String line2,
    String building,
    String apartment,
    String city,
    String postalCode,
    String country,
    Double latitude,
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