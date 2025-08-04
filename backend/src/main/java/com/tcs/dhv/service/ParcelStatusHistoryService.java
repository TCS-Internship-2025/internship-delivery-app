package com.tcs.dhv.service;

import com.tcs.dhv.domain.dto.ParcelStatusHistoryDto;
import com.tcs.dhv.domain.entity.ParcelStatusHistory;
import com.tcs.dhv.repository.ParcelStatusHistoryRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ParcelStatusHistoryService {

    private final ParcelStatusHistoryRepository statusHistoryRepository;

    public List<ParcelStatusHistoryDto> getParcelTimeline(UUID parcelId) {
        final List<ParcelStatusHistory> historyList = statusHistoryRepository.findAllByParcelIdOrderByTimestampAsc(parcelId);
        if (historyList.isEmpty()) {
            throw new EntityNotFoundException("No status history found for parcel ID: " + parcelId);
        }
        return historyList.stream()
                .map(ParcelStatusHistoryDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public ParcelStatusHistoryDto addStatusHistory(ParcelStatusHistory entity) {
        final ParcelStatusHistory saved = statusHistoryRepository.save(entity);
        return ParcelStatusHistoryDto.fromEntity(saved);
    }

    @Transactional
    public ParcelStatusHistoryDto updateStatusHistory(UUID id, ParcelStatusHistory updatedEntity) {
        final ParcelStatusHistory existing = statusHistoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Status history not found for ID: " + id));
        existing.setStatus(updatedEntity.getStatus());
        existing.setDescription(updatedEntity.getDescription());
        existing.setTimestamp(updatedEntity.getTimestamp());
        final ParcelStatusHistory saved = statusHistoryRepository.save(existing);
        return ParcelStatusHistoryDto.fromEntity(saved);
    }

    @Transactional
    public void deleteStatusHistory(UUID id) {
        if (!statusHistoryRepository.existsById(id)) {
            throw new EntityNotFoundException("Status history not found for ID: " + id);
        }
        statusHistoryRepository.deleteById(id);
    }
}
