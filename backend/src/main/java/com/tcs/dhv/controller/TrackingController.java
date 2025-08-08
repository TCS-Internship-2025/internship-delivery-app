package com.tcs.dhv.controller;

import com.tcs.dhv.domain.dto.ParcelStatusHistoryDto;
import com.tcs.dhv.domain.dto.TrackingDto;
import com.tcs.dhv.service.ParcelStatusHistoryService;
import com.tcs.dhv.service.TrackingService;
import com.tcs.dhv.validation.TrackingCode;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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
        @NotNull
        @TrackingCode
        @PathVariable final
        String trackingCode
    ) {
        final var response = trackingService.getTrackingDetails(trackingCode);

        if (response == null) {
            return ResponseEntity.notFound().build();
        }
        log.info("Received tracking request for parcel with id {}", response.parcelId());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{trackingCode}/timeline")
    public ResponseEntity<List<ParcelStatusHistoryDto>> getParcelTimeline(
        @NotNull
        @TrackingCode
        @PathVariable final
        String trackingCode
    ) {
        final var trackingResponse = trackingService.getTrackingDetails(trackingCode);
        final var timeline = parcelStatusHistoryService.getParcelTimeline(trackingResponse.parcelId());

        log.info("Received tracking with timeline request for parcel with id {}", trackingResponse.parcelId());
        return ResponseEntity.ok(timeline);
    }
}
