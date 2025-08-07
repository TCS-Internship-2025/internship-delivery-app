package com.tcs.dhv.controller;

import com.tcs.dhv.domain.dto.ParcelStatusHistoryDto;
import com.tcs.dhv.domain.dto.TrackingDto;
import com.tcs.dhv.security.DhvUserDetails;
import com.tcs.dhv.service.ParcelStatusHistoryService;
import com.tcs.dhv.service.TrackingService;
import com.tcs.dhv.validation.TrackingCode;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Optional;

@Slf4j
@Validated
@RequiredArgsConstructor
@RequestMapping("/api/tracking")
@RestController
public class TrackingController {
    private final TrackingService trackingService;
    private final ParcelStatusHistoryService parcelStatusHistoryService;

    @GetMapping("/{trackingCode}")
    public ResponseEntity<TrackingDto> trackParcel(
            @NotNull @TrackingCode @PathVariable final String trackingCode,
            final Authentication authentication
    ) {
        final var response = getCurrentUser(authentication)
                .map(user -> trackingService.getTrackingDetailsForUser(trackingCode, user.getId(), user.getUsername()))
                .orElseGet(() -> trackingService.getPublicTrackingDetails(trackingCode));

        if (response == null) {
            log.info("Tracking request for code '{}' not found", trackingCode);
            return ResponseEntity.notFound().build();
        }

        log.info("Received tracking request for parcel with id {}", response.parcelId());
        return ResponseEntity.ok(response);
    }

    private Optional<DhvUserDetails> getCurrentUser(
            final Authentication auth
    ) {
        if (auth != null && auth.isAuthenticated()) {
            return Optional.of((DhvUserDetails) auth.getPrincipal());
        }
        return Optional.empty();
    }

    @GetMapping("/{trackingCode}/timeline")
    public ResponseEntity<List<ParcelStatusHistoryDto>> getParcelTimeline(
            @NotNull
            @TrackingCode
            @PathVariable
            String trackingCode
    ) {

        final var trackingResponse = trackingService.getPublicTrackingDetails(trackingCode);
        final var timeline = parcelStatusHistoryService.getParcelTimeline(trackingResponse.parcelId());

        log.info("Received tracking with timeline request for parcel with id {}", trackingResponse.parcelId());
        return ResponseEntity.ok(timeline);
    }
}
