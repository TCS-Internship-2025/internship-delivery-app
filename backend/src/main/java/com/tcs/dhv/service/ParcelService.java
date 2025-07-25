package com.tcs.dhv.service;

import com.tcs.dhv.domain.dto.ParcelRequestDto;
import com.tcs.dhv.domain.dto.ParcelResponseDto;
import com.tcs.dhv.domain.dto.ParcelUpdateDto;
import com.tcs.dhv.domain.entity.User;
import com.tcs.dhv.mapper.ParcelMapper;
import com.tcs.dhv.repository.ParcelRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Random;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ParcelService {

    private final ParcelRepository parcelRepository;
    private final ParcelMapper parcelMapper;

    public ParcelResponseDto createParcel(final ParcelRequestDto requestDto, final User sender) {
        log.info("Creating parcel for user: {}", sender.getEmail());

        final var trackingCode = generateTrackingCode();

        final var parcel = parcelMapper.toEntity(requestDto, sender, trackingCode);
        final var savedParcel = parcelRepository.save(parcel);

        log.info("Parcel created with tracking code: {}", trackingCode);
        return parcelMapper.toResponseDTO(savedParcel);
    }

    public Page<ParcelResponseDto> getUserParcels(final UUID userId, final Pageable pageable) {
        log.info("Retrieving parcels for user ID: {}", userId);

        final var parcelPage = parcelRepository.findAllBySenderId(userId, pageable);
        return parcelPage.map(parcelMapper::toResponseDTO);
    }

    public ParcelResponseDto getParcel(final UUID id) {
        log.info("Retrieving parcel with ID: {}", id);

        return parcelRepository.findById(id)
                .map(parcelMapper::toResponseDTO)
                .orElseThrow(() -> {
                    log.warn("Parcel not found with ID: {}", id);
                    return new EntityNotFoundException("Parcel not found with ID: " + id);
                });
    }

    public ParcelResponseDto updateParcel(final UUID id, final ParcelUpdateDto updateDto, final User sender) {
        log.info("Updating parcel with ID: {} for user: {}", id, sender.getEmail());

        final var existingParcel = parcelRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Parcel not found with ID: " + id));

        parcelMapper.updateEntity(existingParcel, updateDto);
        final var updatedParcel = parcelRepository.save(existingParcel);

        log.info("Parcel with ID: {} updated successfully", id);
        return parcelMapper.toResponseDTO(updatedParcel);
    }

    public void deleteParcel(final UUID id, final User sender) {
        log.info("Deleting parcel with ID: {} for user: {}", id, sender.getEmail());

        final var existingParcel = parcelRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Parcel not found with ID: " + id));

        parcelRepository.delete(existingParcel);
        log.info("Parcel with ID: {} deleted successfully", id);
    }

    private String generateTrackingCode() {
        final var number = new Random().nextLong(1_000_000_000L, 10_000_000_000L);
        final var letters = new StringBuilder();
        for (var i = 0; i < 2; i++) {
            letters.append((char) ('A' + new Random().nextInt(26)));
        }
        return "HU" + number + letters;
    }
}
