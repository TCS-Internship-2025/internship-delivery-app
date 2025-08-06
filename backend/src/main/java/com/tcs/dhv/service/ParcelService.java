package com.tcs.dhv.service;

import com.tcs.dhv.domain.dto.ParcelDto;
import com.tcs.dhv.domain.entity.Parcel;
import com.tcs.dhv.domain.entity.User;
import com.tcs.dhv.domain.enums.ParcelStatus;
import com.tcs.dhv.repository.ParcelRepository;
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
    private final RecipientService recipientService;
    private final UserService userService;
    private final EmailService emailService;
    private final ParcelStatusHistoryService parcelStatusHistoryService;

    private final Random random = new Random();

    @Transactional
    public ParcelDto createParcel(final ParcelDto parcelDto, final UUID userId) {
        log.info("Creating parcel for user: {}", userId);

        final var sender = userService.getUserById(userId);
        final var recipient = recipientService.findOrCreateRecipient(parcelDto.recipient());
        final var trackingCode = generateTrackingCode();

        final var parcel = Parcel.builder()
            .sender(sender)
            .trackingCode(trackingCode)
            .recipient(recipient)
            .currentStatus(ParcelStatus.CREATED)
            .deliveryType(parcelDto.deliveryType())
            .paymentType(parcelDto.paymentType())
            .build();

        final var savedParcel = parcelRepository.saveAndFlush(parcel);
        log.info("Parcel created with tracking code: {}", trackingCode);

        emailService.sendShipmentCreationEmail(sender.getEmail(), savedParcel.getTrackingCode());
        log.info("Parcel creation email sent to email: {}", savedParcel.getRecipient().getEmail());

        final var description = String.format("Parcel created by %s", userService.getUserById(userId).getEmail());
        parcelStatusHistoryService.addStatusHistory(savedParcel.getId(), description);
        log.info("Parcel status entry created: {}", savedParcel.getId());

        return ParcelDto.fromEntity(savedParcel);
    }

    public List<ParcelDto> getUserParcels(final UUID userId) {
        log.info("Retrieving parcels for user: {}", userId);

        final var sender = userService.getUserById(userId);

        final var parcels = parcelRepository.findAllBySenderId(sender.getId());

        return parcels.stream()
            .map(ParcelDto::fromEntity)
            .toList();
    }

    public ParcelDto getParcel(final UUID id, final UUID userId) {
        log.info("Retrieving parcel with ID: {}", id);

        final var sender = userService.getUserById(userId);

        final var parcel = getParcelByIdAndUser(id, sender);

        log.info("Parcel with ID: {} retrieved successfully for user: {}", id, userId);
        return ParcelDto.fromEntity(parcel);
    }


    @Transactional
    public void deleteParcel(final UUID id, final UUID userId) {
        log.info("Deleting parcel with ID: {} for user: {}", id, userId);

        final var sender = userService.getUserById(userId);

        final var parcel = getParcelByIdAndUser(id, sender);


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


    public Parcel getParcelByIdAndUser(final UUID id, final User sender) {

        final var parcel = parcelRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Parcel not found with ID: " + id));

        if (!parcel.getSender().getId().equals(sender.getId())) {
            throw new AccessDeniedException("Access denied");
        }

        return parcel;
    }

}
