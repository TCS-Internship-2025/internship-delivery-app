package com.tcs.dhv.repository;

import com.tcs.dhv.domain.entity.PredefinedLocation;
import com.tcs.dhv.domain.enums.DeliveryType;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface LocationRepository extends JpaRepository<PredefinedLocation, UUID> {
    @EntityGraph(attributePaths = {"address"})
    List<PredefinedLocation> findByDeliveryType(DeliveryType deliveryType);
}
