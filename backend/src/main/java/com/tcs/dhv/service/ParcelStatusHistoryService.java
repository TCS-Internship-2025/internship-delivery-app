package com.tcs.dhv.service;

import com.tcs.dhv.domain.dto.ParcelStatusHistoryDto;
import com.tcs.dhv.domain.entity.ParcelStatusHistory;
import com.tcs.dhv.repository.ParcelStatusHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
        List<ParcelStatusHistory> historyList = statusHistoryRepository.findByParcelIdOrderByTimestampAsc(parcelId);
        return historyList.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
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
