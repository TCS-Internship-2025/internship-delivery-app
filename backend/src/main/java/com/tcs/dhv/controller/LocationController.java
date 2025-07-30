package com.tcs.dhv.controller;

import com.tcs.dhv.domain.dto.LocationDto;
import com.tcs.dhv.service.LocationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/locations")
@RestController
public class LocationController {

    private final LocationService locationService;

    @GetMapping("/pickup-points")
    public ResponseEntity<List<LocationDto>> getPickupPointLocations() {
        log.info("Received request to fetch all pickup points");
        final List<LocationDto> pickupPoints = locationService.getPickupPoints();
        return ResponseEntity.ok(pickupPoints);
    }

    @GetMapping("/parcel-boxes")
    public ResponseEntity<List<LocationDto>> getParcelBoxLocations() {
        log.info("Received request to fetch all parcel box locations");
        final List<LocationDto> parcelBoxes = locationService.getParcelBoxes();
        return ResponseEntity.ok(parcelBoxes);
    }
}
