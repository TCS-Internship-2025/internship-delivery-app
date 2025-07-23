package com.tcs.dhv.service;

import com.tcs.dhv.entity.Parcel;
import com.tcs.dhv.entity.User;
import com.tcs.dhv.repository.ParcelRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ParcelService {

    private final ParcelRepository parcelRepository;

    // TODO: Change the return type to ParcelResponse and parcelCreate to ParcelCreate
    public Parcel createParcel(Parcel parcelCreate, User sender) {
        log.info("Creating parcel for user: {}", sender.getEmail());

        // TODO: Validate recipient address

        // TODO: Validate delivery type and location

        String trackingCode = UUID.randomUUID().toString();

        // TODO: Switch to using a builder pattern for Parcel creation
        Parcel parcel = new Parcel();
//                Parcel.builder()
//                .senderId(sender.getId())
//                .recipientAddressId(parcelCreate.getRecipientAddressId())
//                .trackingCode(trackingCode)
//                .deliveryType(parcelCreate.getDeliveryType())
//                .paymentType(parcelCreate.getPaymentType())
//                .currentStatus(parcelCreate.getCurrentStatus()) // Should be set to CREATED by default
//                .createdAt(parcelCreate.getCreatedAt()) // Should be set with @CreationTimestamp in the entity
//                .updatedAt(parcelCreate.getUpdatedAt()) // Should be set with @UpdateTimestamp in the entity
//                .build();

        parcelRepository.save(parcel);

        // TODO: Create initial status history for the parcel

        // TODO: Send confirmation email to the user

        log.info("Parcel created successfully with tracking code: {}", trackingCode);

        return parcel; // .map(this::convertToResponse);
    }

    // TODO: Change the return type to Page<ParcelResponse>
    public Page<Parcel> getUserParcels(Long userId, Pageable pageable) {
        log.info("Retrieving parcels for user ID: {} with pagination: {}", userId, pageable);

        Page<Parcel> parcelPage = parcelRepository.findAllBySenderId(userId, pageable);
        log.info("Retrieved {} parcels for user ID: {}", parcelPage.getContent().size(), userId);

        return parcelPage; // .map(this::convertToResponse)
    }

    // TODO: Change the return type to ParcelResponse
    public Parcel getParcel(Long id) {
        log.info("Retrieving parcel with ID: {}", id);

        return parcelRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Parcel not found with ID: {}", id);
                    return new EntityNotFoundException("Parcel not found with ID: " + id);
                });
    }

    //
    public Parcel updateParcel(Long id, Parcel parcelUpdates, User sender) {
        log.info("Updating parcel with ID: {} for user: {}", id, sender.getEmail());

        Parcel existingParcel = parcelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Parcel not found with ID: " + id));

        if (!existingParcel.getSenderId().equals(sender.getId())) {
            log.warn("User {} attempted to update parcel {} without permission", sender.getEmail(), id);
            throw new IllegalArgumentException("User does not have permission to update this parcel");
        }

        // TODO: Only update allowed fields. (update DTO should solve this)
        existingParcel.setRecipientAddressId(parcelUpdates.getRecipientAddressId());
        existingParcel.setDeliveryType(parcelUpdates.getDeliveryType());
        existingParcel.setPaymentType(parcelUpdates.getPaymentType());
        existingParcel.setCurrentStatus(parcelUpdates.getCurrentStatus());

        Parcel updatedParcel = parcelRepository.save(existingParcel);
        log.info("Parcel with ID: {} updated successfully for user: {}", id, sender.getEmail());

        return updatedParcel;
    }

    public void deleteParcel(Long id, User sender) {
        log.info("Deleting parcel with ID: {} for user: {}", id, sender.getEmail());

        Parcel existingParcel = parcelRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Parcel not found with ID: " + id));

        if (!existingParcel.getSenderId().equals(sender.getId())) {
            log.warn("User {} attempted to delete parcel {} without permission", sender.getEmail(), id);
            throw new IllegalArgumentException("User does not have permission to delete this parcel");
        }

        parcelRepository.delete(existingParcel);
        log.info("Parcel with ID: {} deleted successfully", id);
    }

    public void /* ParcelStatusResponse */ getParcelStatus(Long id) {
        // Logic to get the status of a parcel
    }
}
