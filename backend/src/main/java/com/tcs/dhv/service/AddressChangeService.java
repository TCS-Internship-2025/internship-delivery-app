package com.tcs.dhv.service;

import com.tcs.dhv.domain.dto.AddressChangeDto;
import com.tcs.dhv.domain.entity.Parcel;
import com.tcs.dhv.domain.enums.ParcelStatus;
import com.tcs.dhv.repository.AddressRepository;
import com.tcs.dhv.repository.ParcelRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

    @Transactional
    public void changeAddress(final UUID parcelId, final AddressChangeDto requestDto, final UUID userId) {
        log.info("Address change for parcel {} by user {}", parcelId, userId);

        final var sender = userService.getUserById(userId);
        final var parcel = getParcelByIdAndUser(parcelId, sender);

        validateAddressChangeRequest(parcel);

        final var oldAddress = parcel.getRecipient().getAddress();
        final var newAddress = requestDto.newAddress().toEntity();
        final var savedAddress = addressRepository.save(newAddress);

        parcel.getRecipient().setAddress(savedAddress);
        parcelRepository.save(parcel);

        parcelStatusHistoryService.addAddressChangeHistory(parcelId, userId, requestDto.requestReason());

        log.info("Address changed successfully for parcel: {} from {} to {}", parcelId, oldAddress.getCity(), savedAddress.getCity());
    }

    private Parcel getParcelByIdAndUser(final UUID parcelId, final com.tcs.dhv.domain.entity.User sender) {
        final var parcel = parcelRepository.findById(parcelId)
            .orElseThrow(() -> new EntityNotFoundException("Parcel not found with ID: " + parcelId));

        if (!parcel.getSender().getId().equals(sender.getId())) {
            throw new AccessDeniedException("Access denied");
        }

        return parcel;
    }

    private void validateAddressChangeRequest(final Parcel parcel) {
        if (!UPDATABLE_STATUSES.contains(parcel.getCurrentStatus())) {
            throw new IllegalStateException("Cannot change address for parcel with status: " + parcel.getCurrentStatus());
        }

        final var timeSinceCreation = Duration.between(parcel.getCreatedAt(), LocalDateTime.now());
        if (timeSinceCreation.toHours() > TIME_LIMIT_HOURS) {
            throw new IllegalStateException("Address change request is beyond the allowed time limit of " + TIME_LIMIT_HOURS + " hours");
        }
    }
}