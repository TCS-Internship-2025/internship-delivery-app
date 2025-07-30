package com.tcs.dhv.repository;

import com.tcs.dhv.domain.entity.ParcelStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ParcelStatusHistoryRepository extends JpaRepository<ParcelStatusHistory, UUID> {
    List<ParcelStatusHistory> findByParcelIdOrderByTimestampAsc(UUID parcelId);
}
