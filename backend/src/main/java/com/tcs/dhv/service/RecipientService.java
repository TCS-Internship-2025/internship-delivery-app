package com.tcs.dhv.service;

import com.tcs.dhv.domain.dto.RecipientDto;
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

    public RecipientDto findOrCreateRecipient(final RecipientDto recipientDto) {
        log.info("Finding or creating recipient with email: {}", recipientDto.email());
        
        final var existingRecipient = recipientRepository.findByEmail(recipientDto.email());
        if (existingRecipient.isPresent()) {
            log.info("Updating existing recipient address for email: {}", recipientDto.email());
            return updateAddress(recipientDto);
        } else {
            log.info("Creating new recipient for email: {}", recipientDto.email());
            return createRecipient(recipientDto);
        }
    }

    private RecipientDto createRecipient(final RecipientDto recipientDto) {
        final var newAddress = recipientDto.address().toEntity();
        final var savedAddress = addressRepository.save(newAddress);

        final var recipient = recipientDto.toEntity();
        recipient.setAddress(savedAddress);
        final var savedRecipient = recipientRepository.save(recipient);

        return RecipientDto.fromEntity(savedRecipient);
    }

    private RecipientDto updateAddress(final RecipientDto recipientDto) {
        log.info("Updating address for recipient with email: {}", recipientDto.email());

        final var recipientEntity = recipientRepository.findByEmail(recipientDto.email())
                .orElseThrow(() -> new EntityNotFoundException("Recipient not found with email: " + recipientDto.email()));
        final var newAddress = recipientDto.address().toEntity();
        final var savedAddress = addressRepository.save(newAddress);

        recipientEntity.setAddress(savedAddress);
        final var savedRecipient = recipientRepository.save(recipientEntity);

        log.info("Recipient address updated successfully for email: {}", recipientDto.email());
        return RecipientDto.fromEntity(savedRecipient);
    }
}
