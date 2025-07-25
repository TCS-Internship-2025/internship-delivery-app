package com.tcs.dhv.mapper;

import com.tcs.dhv.domain.dto.ParcelRequestDto;
import com.tcs.dhv.domain.dto.ParcelResponseDto;
import com.tcs.dhv.domain.dto.ParcelUpdateDto;
import com.tcs.dhv.domain.dto.RecipientDto;
import com.tcs.dhv.domain.entity.Parcel;
import com.tcs.dhv.domain.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.time.LocalDateTime;

@Mapper(
        componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        uses = {AddressMapper.class}
)
public interface ParcelMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "currentStatus", constant = "CREATED")
    @Mapping(target = "sender", source = "sender")
    @Mapping(target = "recipientAddress", source = "dto.address")
    @Mapping(target = "trackingCode", source = "trackingCode")
    Parcel toEntity(ParcelRequestDto dto, User sender, String trackingCode);

    @Mapping(target = "address", source = "recipientAddress")
    @Mapping(target = "recipient", expression = "java(createRecipient())")
    @Mapping(target = "currentStatus", expression = "java(parcel.getCurrentStatus().name())")
    ParcelResponseDto toResponseDTO(Parcel parcel);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "sender", ignore = true)
    @Mapping(target = "trackingCode", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "currentStatus", ignore = true)
    @Mapping(target = "paymentType", ignore = true)
    @Mapping(target = "recipientAddress", ignore = true)
    void updateEntity(@MappingTarget Parcel parcel, ParcelUpdateDto source);

    default RecipientDto createRecipient() {
        return new RecipientDto(
                null,
                "TBD",
                "TBD",
                LocalDateTime.now().toLocalDate(),
                "TBD",
                "tbd@example.com"
        );
    }
}
