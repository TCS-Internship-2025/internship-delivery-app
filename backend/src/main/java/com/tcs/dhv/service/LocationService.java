package com.tcs.dhv.service;

import com.tcs.dhv.domain.dto.LocationDto;
import com.tcs.dhv.domain.enums.DeliveryType;
import com.tcs.dhv.repository.LocationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class LocationService {

    private final LocationRepository locationRepository;

    public List<LocationDto> getLocationsByDeliveryType(final DeliveryType deliveryType) {
        log.info("Fetching locations by delivery type {}", deliveryType);
        return locationRepository.findByDeliveryType(deliveryType)
            .stream()
            .map(LocationDto::fromEntity)
            .toList();
    }
}
