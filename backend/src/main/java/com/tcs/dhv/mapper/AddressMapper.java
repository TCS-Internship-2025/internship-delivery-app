package com.tcs.dhv.mapper;

import com.tcs.dhv.dto.AddressRequestDto;
import com.tcs.dhv.dto.AddressResponseDto;
import com.tcs.dhv.dto.AddressUpdateDto;
import com.tcs.dhv.entity.Address;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(
        componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface AddressMapper {
    Address toEntity(AddressRequestDto addressRequestDTO);

    AddressResponseDto toResponseDTO(Address address);

    void updateEntity(@MappingTarget Address address, AddressUpdateDto source);
}
