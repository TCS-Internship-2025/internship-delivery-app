package com.tcs.dhv.mapper;

import com.tcs.dhv.domain.dto.AddressRequestDto;
import com.tcs.dhv.domain.dto.AddressResponseDto;
import com.tcs.dhv.domain.dto.AddressUpdateDto;
import com.tcs.dhv.domain.entity.Address;
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
