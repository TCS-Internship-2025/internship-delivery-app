package com.tcs.dhv.service;

import com.tcs.dhv.domain.dto.ParcelStatusHistoryDto;
import com.tcs.dhv.domain.entity.ParcelStatusHistory;
import com.tcs.dhv.domain.enums.ParcelStatus;
import com.tcs.dhv.repository.ParcelRepository;
import com.tcs.dhv.repository.ParcelStatusHistoryRepository;
import com.tcs.dhv.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;


@RequiredArgsConstructor
@Service
public class ParcelStatusHistoryService {

    private final ParcelStatusHistoryRepository statusHistoryRepository;
    private final UserRepository userRepository;
    private final ParcelRepository parcelRepository;
    public List<ParcelStatusHistoryDto> getParcelTimeline(UUID parcelId) {
        final List<ParcelStatusHistory> historyList = statusHistoryRepository.findAllByParcelIdOrderByTimestampAsc(parcelId);
        if (historyList.isEmpty()) {
            throw new RuntimeException("No status history found for parcel ID: " + parcelId);
        }
        return historyList.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ParcelStatusHistoryDto addStatusHistory(ParcelStatusHistory entity) {
        final var saved = statusHistoryRepository.save(entity);
        return toDto(saved);
    }
    @Transactional
    public ParcelStatusHistory createStatusHistoryEntry(UUID parcelId, UUID userId) {
        final var user = userRepository.findById(userId)
            .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));

        final var parcel = parcelRepository.findById(parcelId)
            .orElseThrow(() -> new EntityNotFoundException("Parcel not found with ID: " + parcelId));

        return ParcelStatusHistory.builder()
            .parcel(parcel)
            .status(ParcelStatus.CREATED)
            .description("Parcel created by user: " + user.getEmail())
            .timestamp(LocalDateTime.now())
            .build();
    }
    @Transactional
    public ParcelStatusHistoryDto updateStatusHistory(UUID id, ParcelStatusHistory updatedEntity) {
        final var existing = statusHistoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Status history not found for ID: " + id));
        existing.setStatus(updatedEntity.getStatus());
        existing.setDescription(updatedEntity.getDescription());
        existing.setTimestamp(updatedEntity.getTimestamp());
        final var saved = statusHistoryRepository.save(existing);
        return toDto(saved);
    }

    @Transactional
    public void deleteStatusHistory(UUID id) {
        if (!statusHistoryRepository.existsById(id)) {
            throw new RuntimeException("Status history not found for ID: " + id);
        }
        statusHistoryRepository.deleteById(id);
    }

    private ParcelStatusHistoryDto toDto(ParcelStatusHistory entity) {
        return new ParcelStatusHistoryDto(
                entity.getId(),
                entity.getParcel().getId(),
                entity.getStatus(),
                entity.getDescription(),
                entity.getTimestamp()
        );
    }
}