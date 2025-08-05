package com.tcs.dhv.service;

import com.tcs.dhv.domain.dto.ParcelStatusHistoryDto;
import com.tcs.dhv.domain.entity.ParcelStatusHistory;
import com.tcs.dhv.domain.enums.ParcelStatus;
import com.tcs.dhv.repository.ParcelRepository;
import com.tcs.dhv.repository.ParcelStatusHistoryRepository;
import com.tcs.dhv.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;


@Slf4j
@RequiredArgsConstructor
@Service
public class ParcelStatusHistoryService {

    private final ParcelStatusHistoryRepository statusHistoryRepository;
    private final UserRepository userRepository;
    private final ParcelRepository parcelRepository;

    public List<ParcelStatusHistoryDto> getParcelTimeline(final UUID parcelId) {
        final var historyList = statusHistoryRepository.findAllByParcelIdOrderByTimestampAsc(parcelId);
        if (historyList.isEmpty()) {
            throw new RuntimeException("No status history found for parcel ID: " + parcelId);
        }
        log.info("getParcelTimeline for parcel ID: {}", parcelId);
        return historyList.stream()
                .map(ParcelStatusHistoryDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public void addStatusHistory(
        final UUID parcelId,
        final String description
    ) {
        final var entity = createStatusHistoryEntry(parcelId, description);
        statusHistoryRepository.save(entity);
    }

    @Transactional
    public ParcelStatusHistoryDto updateStatusHistory(final UUID id, final ParcelStatusHistory updatedEntity) {
        final var existing = statusHistoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Status history not found for ID: " + id));
        existing.setStatus(updatedEntity.getStatus());
        existing.setDescription(updatedEntity.getDescription());
        existing.setTimestamp(updatedEntity.getTimestamp());
        final var saved = statusHistoryRepository.save(existing);
        return ParcelStatusHistoryDto.fromEntity(saved);
    }

    @Transactional
    public void deleteStatusHistory(final UUID id) {
        if (!statusHistoryRepository.existsById(id)) {
            throw new EntityNotFoundException("Status history not found for ID: " + id);
        }
        statusHistoryRepository.deleteById(id);
    }

    private ParcelStatusHistory createStatusHistoryEntry(final UUID parcelId, final String description) {
        final var parcel = parcelRepository.findById(parcelId)
            .orElseThrow(() -> new EntityNotFoundException("Parcel not found with ID: " + parcelId));

        return ParcelStatusHistory.builder()
            .parcel(parcel)
            .status(parcel.getCurrentStatus())
            .description(description)
            .build();
    }

}