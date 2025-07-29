package com.tcs.dhv.mapper;

import com.tcs.dhv.domain.dto.AddressRequest;
import com.tcs.dhv.domain.dto.AddressUpdate;
import com.tcs.dhv.domain.entity.Address;
import org.springframework.stereotype.Component;

@Component
public class AddressMapper {
    public Address toEntity(AddressRequest request) {
        return Address.builder()
            .line1(request.line1())
            .line2(request.line2())
            .building(request.building())
            .apartment(request.apartment())
            .city(request.city())
            .postalCode(request.postalCode())
            .country(request.country())
            .latitude(request.latitude())
            .longitude(request.longitude())
            .build();
    }

    public AddressRequest toRequest(Address address) {
        return new AddressRequest(
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

    public void updateEntity(Address address, AddressUpdate update) {
        if (update.line1() != null) address.setLine1(update.line1());
        if (update.line2() != null) address.setLine2(update.line2());
        if (update.building() != null) address.setBuilding(update.building());
        if (update.apartment() != null) address.setApartment(update.apartment());
        if (update.city() != null) address.setCity(update.city());
        if (update.postalCode() != null) address.setPostalCode(update.postalCode());
        if (update.country() != null) address.setCountry(update.country());
        if (update.latitude() != null) address.setLatitude(update.latitude());
        if (update.longitude() != null) address.setLongitude(update.longitude());
    }
}
