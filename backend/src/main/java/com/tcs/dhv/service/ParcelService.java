package com.tcs.dhv.service;

import com.tcs.dhv.domain.dto.ParcelDto;
import com.tcs.dhv.domain.entity.Parcel;
import com.tcs.dhv.domain.entity.Recipient;
import com.tcs.dhv.domain.entity.User;
import com.tcs.dhv.repository.AddressRepository;
import com.tcs.dhv.repository.ParcelRepository;
import com.tcs.dhv.repository.RecipientRepository;
import com.tcs.dhv.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@Service
public class ParcelService {

    private static final String TRACKING_CODE_COUNTRY_PREFIX = "HU";
    private static final int TRACKING_CODE_LETTER_COUNT = 2;
    private static final char ALPHABET_START = 'A';
    private static final int ALPHABET_SIZE = 26;
    private static final long TRACKING_NUMBER_MIN = 1_000_000_000L;
    private static final long TRACKING_NUMBER_MAX = 10_000_000_000L;

    private final ParcelRepository parcelRepository;
    private final AddressRepository addressRepository;
    private final RecipientRepository recipientRepository;
    private final UserRepository userRepository;

    private final Random random = new Random();

    @Transactional
    public ParcelDto createParcel(final ParcelDto parcelDto, final String userEmail) {
        log.info("Creating parcel for user: {}", userEmail);

        final var sender = getUserByEmail(userEmail);

        final var existingRecipient = recipientRepository.findByEmail(parcelDto.recipient().email());

        final Recipient recipient;
        if (existingRecipient.isPresent()) {
            log.info("Using existing recipient for email: {}", parcelDto.recipient().email());
            recipient = existingRecipient.get();
        } else {
            log.info("Creating new recipient for email: {}", parcelDto.recipient().email());
            final var address = parcelDto.recipient().address().toEntity();
            final var savedAddress = addressRepository.save(address);

            recipient = parcelDto.recipient().toEntity();
            recipient.setAddress(savedAddress);
            recipientRepository.save(recipient);
        }

        final var trackingCode = generateTrackingCode();

        final var parcel = parcelDto.toEntity(sender, trackingCode);
        parcel.setRecipient(recipient);

        final var savedParcel = parcelRepository.saveAndFlush(parcel);
        log.info("Parcel created with tracking code: {}", trackingCode);

        return ParcelDto.fromEntity(savedParcel);
    }

    public List<ParcelDto> getUserParcels(final String userEmail) {
        log.info("Retrieving parcels for user: {}", userEmail);

        final var sender = getUserByEmail(userEmail);

        final var parcels = parcelRepository.findAllBySenderId(sender.getId());

        return parcels.stream()
            .map(ParcelDto::fromEntity)
            .toList();
    }

    public ParcelDto getParcel(final UUID id, final String userEmail) {
        log.info("Retrieving parcel with ID: {}", id);

        final var sender = getUserByEmail(userEmail);

        final var parcel = getParcelEntity(id, sender);

        log.info("Parcel with ID: {} retrieved successfully for user: {}", id, userEmail);
        return ParcelDto.fromEntity(parcel);
    }

    @Transactional
    public ParcelDto updateParcel(final UUID id, final ParcelDto parcelUpdate, final String userEmail) {
        log.info("Updating parcel with ID: {} for user: {}", id, userEmail);

        final var sender = getUserByEmail(userEmail);

        final var parcel = getParcelEntity(id, sender);

        parcelUpdate.updateEntity(parcel);
        parcel.setUpdatedAt(LocalDateTime.now());

        final var updatedParcel = parcelRepository.saveAndFlush(parcel);
        log.info("Parcel with ID: {} updated successfully", id);
        return ParcelDto.fromEntity(updatedParcel);
    }

    @Transactional
    public void deleteParcel(final UUID id, final String userEmail) {
        log.info("Deleting parcel with ID: {} for user: {}", id, userEmail);

        final var sender = getUserByEmail(userEmail);

        final var parcel = getParcelEntity(id, sender);

        parcelRepository.delete(parcel);
        log.info("Parcel with ID: {} deleted successfully", id);
    }

    private String generateTrackingCode() {
        String code;
        do {
            final var letters = new StringBuilder();
            for (var i = 0; i < TRACKING_CODE_LETTER_COUNT; i++) {
                letters.append((char) (ALPHABET_START + random.nextInt(ALPHABET_SIZE)));
            }
            final var number = random.nextLong(TRACKING_NUMBER_MIN, TRACKING_NUMBER_MAX);
            code = TRACKING_CODE_COUNTRY_PREFIX + number + letters;
        } while (parcelRepository.existsByTrackingCode(code));
        return code;
    }

    private Parcel getParcelEntity(final UUID id, final User sender) {
        final var parcel = parcelRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Parcel not found with ID: " + id));

        if (!parcel.getSender().getId().equals(sender.getId())) {
            throw new AccessDeniedException("Access denied");
        }

        return parcel;
    }

    private User getUserByEmail(final String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new EntityNotFoundException("User not found with email: " + email));
    }
}
