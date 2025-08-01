package com.tcs.dhv.controller;


import com.tcs.dhv.domain.dto.ParcelStatusHistoryDto;
import com.tcs.dhv.domain.dto.TrackingResponse;
import com.tcs.dhv.repository.ParcelRepository;
import com.tcs.dhv.service.ParcelStatusHistoryService;
import com.tcs.dhv.service.TrackingService;

import com.tcs.dhv.validation.TrackingCodeValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/tracking")
@RequiredArgsConstructor
@RestController
public class TrackingController {


    private final TrackingService trackingService;
    private final TrackingCodeValidator  trackingCodeValidator;
    private final ParcelStatusHistoryService parcelStatusHistoryService;
    private final ParcelRepository parcelRepository;

    @GetMapping("/{trackingCode}")
    public ResponseEntity<TrackingResponse> trackParcel(
            @PathVariable String trackingCode
    ) {
        final var response = trackingService.getTrackingDetails(trackingCode);

        if (response == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{trackingCode}/timeline")
    public ResponseEntity<List<ParcelStatusHistoryDto>> getParcelTimeline(
            @PathVariable String trackingCode
    ) {
        if (!trackingCodeValidator.isValid(trackingCode, null)) {
            return ResponseEntity.badRequest().build();
        }
        final var parcelOpt = parcelRepository.findByTrackingCode(trackingCode);
        if (parcelOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        final var timeline = parcelStatusHistoryService.getParcelTimeline(parcelOpt.get().getId());
        return ResponseEntity.ok(timeline);
    }
}
