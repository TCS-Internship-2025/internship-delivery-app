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
import org.springframework.web.bind.annotation.*;

import java.util.List;



@Slf4j
@Validated
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/tracking")
public class TrackingController {


    private final TrackingService trackingService;
    private final ParcelStatusHistoryService parcelStatusHistoryService;

    @GetMapping("/{trackingCode}")
    public ResponseEntity<TrackingDto> trackParcel(
            @NotNull
            @TrackingCode
            @PathVariable
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
            @PathVariable
            String trackingCode
    ) {

        final var trackingResponse = trackingService.getTrackingDetails(trackingCode);
        final var timeline = parcelStatusHistoryService.getParcelTimeline(trackingResponse.parcelId());

        log.info("Received tracking with timeline request for parcel with id {}", trackingResponse.parcelId());
        return ResponseEntity.ok(timeline);
    }
}
