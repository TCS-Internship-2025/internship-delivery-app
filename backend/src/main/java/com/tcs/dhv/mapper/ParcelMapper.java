package com.tcs.dhv.mapper;

import com.tcs.dhv.dto.ParcelRequestDTO;
import com.tcs.dhv.dto.ParcelResponseDTO;
import com.tcs.dhv.dto.ParcelUpdateDTO;
import com.tcs.dhv.dto.RecipientDTO;
import com.tcs.dhv.entity.Parcel;
import com.tcs.dhv.entity.User;
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
    Parcel toEntity(ParcelRequestDTO dto, User sender, String trackingCode);

    @Mapping(target = "address", source = "recipientAddress")
    @Mapping(target = "recipient", expression = "java(createRecipient())")
    @Mapping(target = "currentStatus", expression = "java(parcel.getCurrentStatus().name())")
    ParcelResponseDTO toResponseDTO(Parcel parcel);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "sender", ignore = true)
    @Mapping(target = "trackingCode", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "currentStatus", ignore = true)
    @Mapping(target = "paymentType", ignore = true)
    @Mapping(target = "recipientAddress", ignore = true)
    void updateEntity(@MappingTarget Parcel parcel, ParcelUpdateDTO source);

    default RecipientDTO createRecipient() {
        return new RecipientDTO(
                null,
                "TBD",
                "TBD",
                LocalDateTime.now().toLocalDate(),
                "TBD",
                "tbd@example.com"
        );
    }
}
