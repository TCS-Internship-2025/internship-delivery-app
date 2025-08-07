package com.tcs.dhv.service;

import com.tcs.dhv.domain.dto.RecipientDto;
import com.tcs.dhv.domain.entity.Address;
import com.tcs.dhv.domain.entity.Recipient;
import com.tcs.dhv.repository.AddressRepository;
import com.tcs.dhv.repository.RecipientRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class RecipientService {
    private final RecipientRepository recipientRepository;
    private final AddressRepository addressRepository;

    public Recipient findOrCreateRecipient(final RecipientDto recipientDto) {
        log.info("Finding or creating recipient with email: {}", recipientDto.email());
        
        final var existingRecipient = recipientRepository.findByEmail(recipientDto.email());

        if (existingRecipient.isPresent()) {
            log.info("Updating existing recipient address for email: {}", recipientDto.email());

            updateAddress(recipientDto);

            return recipientRepository.findByEmail(recipientDto.email())
                    .orElseThrow(() -> new EntityNotFoundException("Recipient not found with email: " + recipientDto.email()));

        } else {
            log.info("Creating new recipient for email: {}", recipientDto.email());

            final var newAddress = Address.builder()
                .line1(recipientDto.address().line1())
                .line2(recipientDto.address().line2())
                .building(recipientDto.address().building())
                .apartment(recipientDto.address().apartment())
                .city(recipientDto.address().city())
                .country(recipientDto.address().country())
                .postalCode(recipientDto.address().postalCode())
                .longitude(recipientDto.address().longitude())
                .latitude(recipientDto.address().latitude())
                .build();

            final var savedAddress = addressRepository.saveAndFlush(newAddress);

            final var recipient = Recipient.builder()
                .name(recipientDto.name())
                .email(recipientDto.email())
                .phone(recipientDto.phone())
                .birthDate(recipientDto.birthDate())
                .address(savedAddress)
                .build();

            return recipientRepository.saveAndFlush(recipient);
        }
    }

    private void updateAddress(final RecipientDto recipientDto) {
        log.info("Updating address for recipient with email: {}", recipientDto.email());

        final var recipientEntity = recipientRepository.findByEmail(recipientDto.email())
                .orElseThrow(() -> new EntityNotFoundException("Recipient not found with email: " + recipientDto.email()));

        final var newAddress = recipientDto.address().toEntity();
        final var savedAddress = addressRepository.saveAndFlush(newAddress);

        recipientEntity.setAddress(savedAddress);
        recipientRepository.saveAndFlush(recipientEntity);

        log.info("Recipient address updated successfully for email: {}", recipientDto.email());
    }
}
