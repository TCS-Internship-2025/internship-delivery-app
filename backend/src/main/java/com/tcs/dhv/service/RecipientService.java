package com.tcs.dhv.service;

import com.tcs.dhv.domain.dto.RecipientDto;
import com.tcs.dhv.domain.entity.Recipient;
import com.tcs.dhv.repository.RecipientRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class RecipientService {

    private final RecipientRepository recipientRepository;

    public Recipient createRecipient(final RecipientDto recipientDto) {
        log.info("Creating recipient with email: {}", recipientDto.email());

        final var recipient = Recipient.builder()
            .name(recipientDto.name())
            .email(recipientDto.email())
            .phone(recipientDto.phone())
            .birthDate(recipientDto.birthDate())
            .build();

        return recipientRepository.saveAndFlush(recipient);
    }

    public Recipient findOrCreateRecipient(final RecipientDto recipientDto) {
        log.info("Finding or creating recipient with email: {}", recipientDto.email());
        
        return recipientRepository.findByEmail(recipientDto.email()).orElseGet(() -> createRecipient(recipientDto));
    }
}
