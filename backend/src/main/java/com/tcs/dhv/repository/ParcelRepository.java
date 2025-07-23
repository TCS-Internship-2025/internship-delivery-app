package com.tcs.dhv.repository;

import com.tcs.dhv.entity.Parcel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ParcelRepository extends JpaRepository<Parcel, Long> {
    Page<Parcel> findAllBySenderId(Long userId, Pageable pageable);
}
