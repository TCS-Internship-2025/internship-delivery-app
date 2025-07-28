package com.tcs.dhv.mapper;

import com.tcs.dhv.domain.dto.RecipientDto;
import com.tcs.dhv.domain.entity.Recipient;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(
    componentModel = "spring",
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
    uses = {AddressMapper.class}
)
public interface RecipientMapper {

    @Mapping(target = "id", ignore = true)
    Recipient toEntity(RecipientDto dto);

    RecipientDto toDto(Recipient entity);
}
