package com.tcs.dhv.service;

import com.tcs.dhv.domain.dto.AddressChangeDto;
import com.tcs.dhv.domain.entity.Parcel;
import com.tcs.dhv.domain.enums.ParcelStatus;
import com.tcs.dhv.repository.AddressRepository;
import com.tcs.dhv.repository.ParcelRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

    private static final int TIME_LIMIT_HOURS = 2;
    private static final List<ParcelStatus> UPDATABLE_STATUSES = List.of(
        ParcelStatus.CREATED,
        ParcelStatus.PICKED_UP,
        ParcelStatus.IN_TRANSIT
    );

    private final ParcelRepository parcelRepository;
    private final AddressRepository addressRepository;
    private final UserService userService;
    private final ParcelService parcelService;

    @Transactional
    public void changeAddress(final UUID parcelId, final AddressChangeDto requestDto, final String userEmail) {
        log.info("Address change for parcel {} by user {}", parcelId, userEmail);

        final var sender = userService.getUserByEmail(userEmail);
        final var parcel = parcelService.getParcelByIdAndUser(parcelId, sender);

        validateAddressChangeRequest(parcel);

        final var oldAddress = parcel.getRecipient().getAddress();
        final var newAddress = requestDto.newAddress().toEntity();
        final var savedAddress = addressRepository.save(newAddress);

        parcel.getRecipient().setAddress(savedAddress);
        parcelRepository.save(parcel);

        // TODO: Add to status history

        log.info("Address changed successfully for parcel: {} from {} to {}", parcelId, oldAddress.getCity(), savedAddress.getCity());
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