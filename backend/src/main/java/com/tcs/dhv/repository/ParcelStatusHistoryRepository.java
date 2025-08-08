package com.tcs.dhv.repository;

import com.tcs.dhv.domain.entity.ParcelStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ParcelStatusHistoryRepository extends JpaRepository<ParcelStatusHistory, UUID> {
    List<ParcelStatusHistory> findAllByParcelIdOrderByTimestampAsc(UUID parcelId);
}