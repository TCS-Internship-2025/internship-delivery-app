package com.tcs.dhv.controller;

import com.tcs.dhv.domain.dto.LocationDto;
import com.tcs.dhv.domain.enums.DeliveryType;
import com.tcs.dhv.service.LocationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "Locations", description = "Locations related methods")
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/locations")
@RestController
public class LocationController {

    private final LocationService locationService;

    @Operation(
        summary = "Get locations",
        description = "Get the delivery locations by its types"
    )
    @GetMapping
    public ResponseEntity<List<LocationDto>> getLocations(@Valid @RequestParam final DeliveryType deliveryType) {
        log.info("Received request for locations by delivery type {} :",  deliveryType);
        final var locations = locationService.getLocationsByDeliveryType(deliveryType);
        log.info("Found {} locations of type {}", locations.size(), deliveryType);
        return ResponseEntity.ok(locations);
    }
}
