package com.tcs.dhv.repository;

import org.springframework.stereotype.Repository;

@Repository
public interface ParcelRepository /* extends JpaRepository<Parcel, Long> */ {
    boolean existsByTrackingCode(String trackingCode);
}
