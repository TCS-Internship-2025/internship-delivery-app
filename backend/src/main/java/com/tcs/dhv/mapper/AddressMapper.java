package com.tcs.dhv.mapper;

import com.tcs.dhv.dto.AddressRequestDTO;
import com.tcs.dhv.dto.AddressResponseDTO;
import com.tcs.dhv.dto.AddressUpdateDTO;
import com.tcs.dhv.entity.Address;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(
        componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface AddressMapper {
    Address toEntity(AddressRequestDTO addressRequestDTO);

    AddressResponseDTO toResponseDTO(Address address);

    void updateEntity(@MappingTarget Address address, AddressUpdateDTO source);
}
