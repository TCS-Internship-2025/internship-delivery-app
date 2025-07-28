package com.tcs.dhv.service;

import com.tcs.dhv.domain.dto.ParcelRequest;
import com.tcs.dhv.domain.dto.ParcelResponse;
import com.tcs.dhv.domain.dto.ParcelUpdate;
import com.tcs.dhv.mapper.AddressMapper;
import com.tcs.dhv.mapper.ParcelMapper;
import com.tcs.dhv.mapper.RecipientMapper;
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

    private final ParcelMapper parcelMapper;
    private final AddressMapper addressMapper;
    private final RecipientMapper recipientMapper;

    private final Random random = new Random();

    @Transactional
    public ParcelResponse createParcel(final ParcelRequest parcelRequest, final String userEmail) {
        log.info("Creating parcel for user: {}", userEmail);

        final var sender = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new EntityNotFoundException("User not found with email: " + userEmail));

        final var address = addressMapper.toEntity(parcelRequest.recipient().address());
        final var savedAddress = addressRepository.save(address);

        final var recipient = recipientMapper.toEntity(parcelRequest.recipient());
        recipient.setAddress(savedAddress);
        final var savedRecipient = recipientRepository.save(recipient);

        final var trackingCode = generateTrackingCode();
        final var parcel = parcelMapper.toEntity(parcelRequest, sender, trackingCode);
        parcel.setRecipient(savedRecipient);
        final var savedParcel = parcelRepository.save(parcel);

        log.info("Parcel created with tracking code: {}", trackingCode);
        return parcelMapper.toResponse(savedParcel);
    }

    public List<ParcelResponse> getUserParcels(final String userEmail) {
        log.info("Retrieving parcels for user: {}", userEmail);

        final var sender = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new EntityNotFoundException("User not found with email: " + userEmail));

        final var parcels = parcelRepository.findAllBySenderId(sender.getId());
        return parcels.stream()
            .map(parcelMapper::toResponse)
            .toList();
    }

    public ParcelResponse getParcel(final UUID id, final String userEmail) {
        log.info("Retrieving parcel with ID: {}", id);

        final var parcel = parcelRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Parcel not found with ID: " + id));

        final var sender = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new EntityNotFoundException("User not found with email: " + userEmail));

        if (!parcel.getSender().getId().equals(sender.getId())) {
            throw new AccessDeniedException("Access denied");
        }

        log.info("Parcel with ID: {} retrieved successfully for user: {}", id, userEmail);
        return parcelMapper.toResponse(parcel);
    }

    @Transactional
    public ParcelResponse updateParcel(final UUID id, final ParcelUpdate parcelUpdate, final String userEmail) {
        log.info("Updating parcel with ID: {} for user: {}", id, userEmail);

        final var parcel = parcelRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Parcel not found with ID: " + id));

        final var sender = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new EntityNotFoundException("User not found with email: " + userEmail));

        if (!parcel.getSender().getId().equals(sender.getId())) {
            throw new AccessDeniedException("Access denied");
        }

        parcelMapper.updateEntity(parcel, parcelUpdate);

        if (parcelUpdate.address() != null) {
            final var recipientAddress = parcel.getRecipient().getAddress();
            addressMapper.updateEntity(recipientAddress, parcelUpdate.address());
        }

        final var updatedParcel = parcelRepository.save(parcel);
        log.info("Parcel with ID: {} updated successfully", id);
        return parcelMapper.toResponse(updatedParcel);
    }

    @Transactional
    public void deleteParcel(final UUID id, final String userEmail) {
        log.info("Deleting parcel with ID: {} for user: {}", id, userEmail);

        final var parcel = parcelRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Parcel not found with ID: " + id));

        final var sender = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new EntityNotFoundException("User not found with email: " + userEmail));

        if (!parcel.getSender().getId().equals(sender.getId())) {
            throw new AccessDeniedException("Access denied");
        }

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
}
