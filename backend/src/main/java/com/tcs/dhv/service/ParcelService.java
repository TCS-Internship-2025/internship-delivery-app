package com.tcs.dhv.service;

import com.tcs.dhv.domain.dto.ParcelDto;
import com.tcs.dhv.domain.dto.StatusUpdateDto;
import com.tcs.dhv.domain.entity.Parcel;
import com.tcs.dhv.domain.entity.User;
import com.tcs.dhv.domain.enums.ParcelStatus;
import com.tcs.dhv.domain.event.ParcelCreatedEvent;
import com.tcs.dhv.domain.event.ParcelStatusUpdatedEvent;
import com.tcs.dhv.repository.AddressRepository;
import com.tcs.dhv.repository.ParcelRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.List;
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

    private final ParcelStatusHistoryService parcelStatusHistoryService;
    private final RecipientService recipientService;
    private final UserService userService;
    private final ParcelRepository parcelRepository;
    private final AddressRepository addressRepository;
    private final ParcelCacheService parcelCacheService;
    private final ApplicationEventPublisher applicationEventPublisher;

    private final SecureRandom secureRandom = new SecureRandom();
    private static final int MAX_TRACKING_CODE_ATTEMPTS = 100;

    @Transactional
    public ParcelDto createParcel(
        final ParcelDto parcelDto,
        final UUID userId
    ) {
        log.info("Creating parcel for user: {}", userId);

        final var savedParcel = createAndSaveParcel(parcelDto, userId);
        log.info("Parcel created with tracking code: {}", savedParcel.getTrackingCode());

        applicationEventPublisher.publishEvent(new ParcelCreatedEvent(savedParcel));

        return ParcelDto.fromEntity(savedParcel);
    }

    private Parcel createAndSaveParcel(final ParcelDto parcelDto, final UUID userId) {
        final var sender = userService.getUserById(userId);
        final var recipient = recipientService.createRecipient(parcelDto.recipient());
        final var trackingCode = generateTrackingCode();

        final var address = parcelDto.address().toEntity();
        final var savedAddress = addressRepository.save(address);

        final var parcel = Parcel.builder()
            .sender(sender)
            .trackingCode(trackingCode)
            .address(savedAddress)
            .recipient(recipient)
            .currentStatus(ParcelStatus.CREATED)
            .deliveryType(parcelDto.deliveryType())
            .paymentType(parcelDto.paymentType())
            .build();

        return parcelRepository.save(parcel);
    }

    public List<ParcelDto> getUserParcels(final UUID userId) {
        log.info("Retrieving parcels for user: {}", userId);

        final var parcels = parcelRepository.findAllBySenderId(userId);

        return parcels.stream()
            .map(ParcelDto::fromEntity)
            .toList();
    }

    @Cacheable(value = "parcels", key = "#userId.toString().concat('-').concat(#id.toString())")
    @PreAuthorize("@parcelService.isParcelOwner(#id, #userId)")
    public ParcelDto getParcel(
        final UUID id,
        final UUID userId
    ) {
        log.info("Retrieving parcel with ID: {}", id);

        final var sender = userService.getUserById(userId);

        final var parcel = getParcelByIdAndUser(id, sender);

        log.info("Parcel with ID: {} retrieved successfully for user: {}", id, userId);
        return ParcelDto.fromEntity(parcel);
    }


    @Transactional
    @CacheEvict(value = "parcels", key = "#userId.toString().concat('-').concat(#id.toString())")
    @PreAuthorize("@parcelService.isParcelOwner(#id, #userId)")
    public void deleteParcel(
        final UUID id,
        final UUID userId
    ) {
        log.info("Deleting parcel with ID: {} for user: {}", id, userId);

        final var sender = userService.getUserById(userId);

        final var parcel = getParcelByIdAndUser(id, sender);


        parcelRepository.delete(parcel);
        log.info("Parcel with ID: {} deleted successfully", id);
    }

    private String generateTrackingCode() {
        String code;
        var attempts = 0;
        
        do {
            if (++attempts > MAX_TRACKING_CODE_ATTEMPTS) {
                throw new IllegalStateException("Could not generate unique tracking code after " + MAX_TRACKING_CODE_ATTEMPTS + " attempts");
            }

            final var letters = new StringBuilder();
            for (var i = 0; i < TRACKING_CODE_LETTER_COUNT; i++) {
                letters.append((char) (ALPHABET_START + secureRandom.nextInt(ALPHABET_SIZE)));
            }
            final var number = secureRandom.nextLong(TRACKING_NUMBER_MIN, TRACKING_NUMBER_MAX);
            code = TRACKING_CODE_COUNTRY_PREFIX + number + letters;
        } while (parcelRepository.existsByTrackingCode(code));

        return code;
    }


    public Parcel getParcelByIdAndUser(
        final UUID id,
        final User sender
    ) {
        final var parcel = parcelRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Parcel not found with ID: " + id));

        if (!parcel.getSender().getId().equals(sender.getId())) {
            throw new AccessDeniedException("Access denied");
        }

        return parcel;
    }

    @Transactional
    public ParcelDto updateParcelStatus(final String trackingCode, final StatusUpdateDto statusDto) {
        final var parcel = parcelRepository.findByTrackingCode(trackingCode)
            .orElseThrow(() -> new EntityNotFoundException("Parcel not found with tracking code: " + trackingCode));

        applicationEventPublisher.publishEvent(new ParcelStatusUpdatedEvent(parcel));
        return parcelCacheService.updateStatusAndCache(parcel.getId(), parcel.getSender().getId(), parcel, statusDto);
    }

    public boolean isParcelOwner(final UUID parcelId, final UUID userId) {
        try {
            final var parcel = parcelRepository.findById(parcelId);
            return parcel.isPresent() && parcel.get().getSender().getId().equals(userId);
        } catch (final Exception e) {
            log.warn("Error checking parcel ownership for parcel {} and user {}: {}", parcelId, userId, e.getMessage());
            return false;
        }
    }
}
