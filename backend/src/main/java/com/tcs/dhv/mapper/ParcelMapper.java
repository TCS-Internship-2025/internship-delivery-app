package com.tcs.dhv.mapper;

import com.tcs.dhv.domain.dto.ParcelRequest;
import com.tcs.dhv.domain.dto.ParcelResponse;
import com.tcs.dhv.domain.dto.ParcelUpdate;
import com.tcs.dhv.domain.entity.Parcel;
import com.tcs.dhv.domain.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(
        componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        uses = {AddressMapper.class, RecipientMapper.class}
)
public interface ParcelMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "currentStatus", constant = "CREATED")
    @Mapping(target = "sender", source = "sender")
    @Mapping(target = "recipient", source = "dto.recipient")
    @Mapping(target = "trackingCode", source = "trackingCode")
    @Mapping(target = "paymentType", source = "dto.paymentType")
    @Mapping(target = "deliveryType", source = "dto.deliveryType")
    Parcel toEntity(ParcelRequest dto, User sender, String trackingCode);

    @Mapping(target = "recipient", source = "recipient")
    @Mapping(target = "currentStatus", expression = "java(parcel.getCurrentStatus().name())")
    ParcelResponse toResponse(Parcel parcel);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "sender", ignore = true)
    @Mapping(target = "recipient", ignore = true)
    @Mapping(target = "trackingCode", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "currentStatus", ignore = true)
    @Mapping(target = "paymentType", ignore = true)
    void updateEntity(@MappingTarget Parcel parcel, ParcelUpdate source);
}