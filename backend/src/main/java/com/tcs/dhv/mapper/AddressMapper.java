package com.tcs.dhv.mapper;

import com.tcs.dhv.domain.dto.AddressRequest;
import com.tcs.dhv.domain.dto.AddressResponse;
import com.tcs.dhv.domain.dto.AddressUpdate;
import com.tcs.dhv.domain.entity.Address;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(
        componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface AddressMapper {
    Address toEntity(AddressRequest addressRequest);

    AddressResponse toResponseDTO(Address address);

    void updateEntity(@MappingTarget Address address, AddressUpdate source);
}
