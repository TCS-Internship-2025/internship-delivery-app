package com.tcs.dhv.service;

import com.tcs.dhv.domain.dto.AddressChangeDto;
import com.tcs.dhv.domain.dto.AddressDto;
import com.tcs.dhv.domain.entity.Parcel;
import com.tcs.dhv.domain.enums.ParcelStatus;
import com.tcs.dhv.repository.AddressRepository;
import com.tcs.dhv.repository.ParcelRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.OptimisticLockException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.dao.ConcurrencyFailureException;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@Service
public class AddressChangeService {

    private static final int TIME_LIMIT_HOURS = 24;
    private static final List<ParcelStatus> UPDATABLE_STATUSES = List.of(
        ParcelStatus.CREATED,
        ParcelStatus.PICKED_UP,
        ParcelStatus.IN_TRANSIT
    );

    private final ParcelRepository parcelRepository;
    private final AddressRepository addressRepository;
    private final UserService userService;
    private final ParcelStatusHistoryService parcelStatusHistoryService;
    private final EmailService emailService;

    @Transactional
    @CacheEvict(value = "parcels", key = "#userId.toString().concat('-').concat(#parcelId.toString())")
    public AddressDto changeAddress(
        final UUID parcelId,
        final AddressChangeDto requestDto,
        final UUID userId
    ) {
        try {
            log.info("Address change for parcel {} by user {}", parcelId, userId);

            final var sender = userService.getUserById(userId);
            final var parcel = getParcelByIdAndUser(parcelId, sender);

            validateAddressChangeRequest(parcel);

            final var oldAddress = parcel.getAddress();
            final var newAddress = requestDto.newAddress().toEntity();
            final var savedAddress = addressRepository.saveAndFlush(newAddress);

            parcel.setDeliveryType(requestDto.deliveryType());
            parcel.setAddress(savedAddress);
            parcelRepository.saveAndFlush(parcel);

            emailService.sendAddressChangeNotification(
                parcel.getRecipient().getEmail(),
                parcel.getRecipient().getName(),
                parcel.getTrackingCode(),
                oldAddress,
                newAddress,
                requestDto.requestReason()
            );
            log.info("Address change notification email sent to email: {}", parcel.getRecipient().getEmail());

            final var description = String.format(
                "Address changed by %s%s",
                sender.getEmail(),
                requestDto.requestReason() != null && !requestDto.requestReason().trim().isEmpty() ? ". Reason: " + requestDto.requestReason() : "");
            parcelStatusHistoryService.addStatusHistory(parcelId, description);

            log.info("Address changed successfully for parcel: {} from {} to {}", parcelId, oldAddress.getCity(), savedAddress.getCity());

            return AddressDto.fromEntity(savedAddress);
        } catch (final OptimisticLockException | ObjectOptimisticLockingFailureException e) {
            log.warn("Optimistic lock conflict while changing address for parcel {} by user {}: {}",
                parcelId, userId, e.getMessage());
            throw new ConcurrencyFailureException("Address was modified by another session");
        }
    }

    private Parcel getParcelByIdAndUser(
        final UUID parcelId,
        final com.tcs.dhv.domain.entity.User sender
    ) {
        final var parcel = parcelRepository.findById(parcelId)
            .orElseThrow(() -> new EntityNotFoundException("Parcel not found with ID: " + parcelId));

        if (!parcel.getSender().getId().equals(sender.getId())) {
            throw new AccessDeniedException("Access denied");
        }

        return parcel;
    }

    private void validateAddressChangeRequest(final Parcel parcel) {
        if (!UPDATABLE_STATUSES.contains(parcel.getCurrentStatus())) {
            throw new IllegalStateException("Cannot change address for parcel with status: "
                + parcel.getCurrentStatus());
        }

        final var timeSinceCreation = Duration.between(parcel.getCreatedAt(), LocalDateTime.now());
        if (timeSinceCreation.toHours() > TIME_LIMIT_HOURS) {
            throw new IllegalStateException("Address change request is beyond the allowed time limit of "
                + TIME_LIMIT_HOURS + " hours");
        }
    }
}
