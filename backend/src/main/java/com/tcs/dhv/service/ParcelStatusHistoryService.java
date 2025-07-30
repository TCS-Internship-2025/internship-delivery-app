package com.tcs.dhv.service;

import com.tcs.dhv.domain.dto.ParcelStatusHistoryDto;
import com.tcs.dhv.domain.entity.ParcelStatusHistory;
import com.tcs.dhv.repository.ParcelStatusHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ParcelStatusHistoryService {

    private final ParcelStatusHistoryRepository statusHistoryRepository;

    @Autowired
    public ParcelStatusHistoryService(ParcelStatusHistoryRepository statusHistoryRepository) {
        this.statusHistoryRepository = statusHistoryRepository;
    }

    public List<ParcelStatusHistoryDto> getParcelTimeline(UUID parcelId) {
        List<ParcelStatusHistory> historyList = statusHistoryRepository.findAllByParcelIdOrderByTimestampAsc(parcelId);
        if (historyList.isEmpty()) {
            throw new RuntimeException("No status history found for parcel ID: " + parcelId);
        }
        return historyList.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ParcelStatusHistoryDto addStatusHistory(ParcelStatusHistory entity) {
        ParcelStatusHistory saved = statusHistoryRepository.save(entity);
        return toDto(saved);
    }

    @Transactional
    public ParcelStatusHistoryDto updateStatusHistory(UUID id, ParcelStatusHistory updatedEntity) {
        ParcelStatusHistory existing = statusHistoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Status history not found for ID: " + id));
        existing.setStatus(updatedEntity.getStatus());
        existing.setDescription(updatedEntity.getDescription());
        existing.setTimestamp(updatedEntity.getTimestamp());
        ParcelStatusHistory saved = statusHistoryRepository.save(existing);
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
                entity.getStatus().name(),
                entity.getDescription(),
                entity.getTimestamp()
        );
    }
}