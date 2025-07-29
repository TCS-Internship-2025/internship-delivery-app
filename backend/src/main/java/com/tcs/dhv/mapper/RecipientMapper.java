package com.tcs.dhv.mapper;

import com.tcs.dhv.domain.dto.AddressUpdate;
import com.tcs.dhv.domain.dto.RecipientDto;
import com.tcs.dhv.domain.entity.Recipient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class RecipientMapper {

    private final AddressMapper addressMapper;

    public Recipient toEntity(RecipientDto dto) {
        return Recipient.builder()
            .name(dto.name())
            .email(dto.email())
            .phone(dto.phone())
            .birthDate(dto.birthDate())
            .address(addressMapper.toEntity(dto.address()))
            .build();
    }

    public RecipientDto toDto(Recipient entity) {
        return new RecipientDto(
            entity.getName(),
            entity.getEmail(),
            entity.getPhone(),
            entity.getBirthDate(),
            addressMapper.toRequest(entity.getAddress())
        );
    }

    public void updateEntity(Recipient recipient, AddressUpdate addressUpdate) {
        if (addressUpdate != null) {
            addressMapper.updateEntity(recipient.getAddress(), addressUpdate);
        }
    }
}