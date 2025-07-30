package com.tcs.dhv.service;

import com.tcs.dhv.domain.dto.LocationDto;
import com.tcs.dhv.domain.enums.DeliveryType;
import com.tcs.dhv.repository.LocationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class LocationService {

    private final LocationRepository locationRepository;

    public List<LocationDto> getPickupPoints() {
        return locationRepository.findByDeliveryType(DeliveryType.PICKUP_POINT)
            .stream()
            .map(LocationDto::fromEntity)
            .toList();
    }

    public List<LocationDto> getParcelBoxes() {
        return locationRepository.findByDeliveryType(DeliveryType.PARCEL_BOX)
            .stream()
            .map(LocationDto::fromEntity)
            .toList();
    }
}
