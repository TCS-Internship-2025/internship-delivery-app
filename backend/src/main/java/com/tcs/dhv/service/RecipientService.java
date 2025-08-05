package com.tcs.dhv.service;

import com.tcs.dhv.domain.dto.RecipientDto;
import com.tcs.dhv.domain.entity.Recipient;
import com.tcs.dhv.repository.AddressRepository;
import com.tcs.dhv.repository.RecipientRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.OptimisticLockException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.ConcurrencyFailureException;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
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
            final var newAddress = recipientDto.address().toEntity();
            final var savedAddress = addressRepository.save(newAddress);

            final var recipient = recipientDto.toEntity();
            recipient.setAddress(savedAddress);
            return recipientRepository.save(recipient);
        }
    }

    private void updateAddress(final RecipientDto recipientDto) {
        try{
            log.info("Updating address for recipient with email: {}", recipientDto.email());

            final var recipientEntity = recipientRepository.findByEmail(recipientDto.email())
                .orElseThrow(() -> new EntityNotFoundException("Recipient not found with email: " + recipientDto.email()));
            final var newAddress = recipientDto.address().toEntity();
            final var savedAddress = addressRepository.save(newAddress);

            recipientEntity.setAddress(savedAddress);
            recipientRepository.save(recipientEntity);

            log.info("Recipient address updated successfully for email: {}", recipientDto.email());
        }
        catch(final OptimisticLockException | ObjectOptimisticLockingFailureException ex){
            log.warn("Optimistic-lock conflict for recipient {}: {}", recipientDto.email(), ex.getMessage());
            throw new ConcurrencyFailureException("Recipient's address was updated by another session");
        }


    }
}
