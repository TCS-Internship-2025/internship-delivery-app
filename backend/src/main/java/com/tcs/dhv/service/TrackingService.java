package com.tcs.dhv.service;

import com.tcs.dhv.domain.dto.RecipientDto;
import com.tcs.dhv.domain.dto.TrackingDto;
import com.tcs.dhv.domain.entity.Parcel;
import com.tcs.dhv.repository.ParcelRepository;
import com.tcs.dhv.security.DhvUserDetails;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@Service
public class TrackingService {

    private final ParcelRepository parcelRepository;

    private final UserService userService;

    @CacheEvict(value = "trackingDetails", key = "#trackingCode")
    public TrackingDto getPublicTrackingDetails(final String trackingCode) {
        log.info("getPublicTrackingDetails");
        final var parcel = parcelRepository.findByTrackingCode(trackingCode)
            .orElseThrow(() -> new EntityNotFoundException("Parcel not found for tracking code: " + trackingCode));

        log.info("Getting PUBLIC tracking data of parcel with id : {}", parcel.getId());

        final var recipient = parcel.getRecipient();

        return TrackingDto.builder()
            .parcelId(parcel.getId())
            .trackingCode(parcel.getTrackingCode())
            .senderName(parcel.getSender().getName())
            .currentStatus(parcel.getCurrentStatus())
            .estimateDelivery(calculateEstimatedDeliveryTime(parcel))
            .recipient(new RecipientDto(
                recipient.getTitle(),
                recipient.getName(),
                null,
                null,
                null
            ))
            .paymentType(String.valueOf(parcel.getPaymentType()))
            .deliveryType(String.valueOf(parcel.getDeliveryType()))
            .build();
    }

    public TrackingDto getTrackingDetailsForUser(
        final String trackingCode,
        final UUID userId,
        final String userEmail
    ) {
        log.info("getTrackingDetailsforUser");
        final var parcel = parcelRepository.findByTrackingCode(trackingCode)
            .orElseThrow(() -> new EntityNotFoundException("Parcel not found for tracking code: " + trackingCode));

        log.info("Getting PRIVATE tracking data of parcel with id: {} for user: {}", parcel.getId(), userId);

        final var isSender = parcel.getSender().getId().equals(userId);
        final var isRecipient = parcel.getRecipient().getEmail().equals(userEmail);

        if (!(isSender || isRecipient)) {
            return getPublicTrackingDetails(trackingCode);
        }

        final var sender = parcel.getSender();
        final var recipient = parcel.getRecipient();

        return TrackingDto.builder()
            .parcelId(parcel.getId())
            .trackingCode(parcel.getTrackingCode())
            .senderName(sender.getName())
            .senderEmail(sender.getEmail())
            .senderPhone(sender.getPhone())
            .currentStatus(parcel.getCurrentStatus())
            .estimateDelivery(calculateEstimatedDeliveryTime(parcel))
            .recipient(RecipientDto.fromEntity(recipient))
            .paymentType(String.valueOf(parcel.getPaymentType()))
            .deliveryType(String.valueOf(parcel.getDeliveryType()))
            .build();
    }

    private Optional<LocalDateTime> calculateEstimatedDeliveryTime(final Parcel parcel) {
        return switch (parcel.getCurrentStatus()) {
            case CREATED -> Optional.of(parcel.getCreatedAt().plusDays(7));
            case PICKED_UP -> Optional.of(parcel.getUpdatedAt().plusDays(5));
            case IN_TRANSIT -> Optional.of(parcel.getUpdatedAt().plusDays(4));
            case OUT_FOR_DELIVERY -> Optional.of(parcel.getUpdatedAt().plusDays(2));
            case DELIVERY_ATTEMPTED -> Optional.of(parcel.getUpdatedAt().plusDays(1));
            case DELIVERED, CANCELLED, RETURNED_TO_SENDER -> Optional.empty();
        };
    }

    public Optional<DhvUserDetails> getCurrentUser(final Authentication auth) {
        if (auth != null && auth.isAuthenticated()) {
            final Object principal = auth.getPrincipal();

            if (principal instanceof final DhvUserDetails userDetails) {
                return Optional.of(userDetails);
            }

            if (principal instanceof final Jwt jwt) {
                final UUID userId = UUID.fromString(jwt.getSubject());

                return Optional.ofNullable(userService.getUserById(userId))
                    .map(DhvUserDetails::new);
            }
        }
        return Optional.empty();
    }
}
