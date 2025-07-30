package com.tcs.dhv.controller;

import com.tcs.dhv.domain.dto.ParcelStatusHistoryDto;
import com.tcs.dhv.domain.dto.TrackingRequest;
import com.tcs.dhv.domain.dto.TrackingResponse;
import com.tcs.dhv.repository.ParcelRepository;
import com.tcs.dhv.service.ParcelStatusHistoryService;
import com.tcs.dhv.service.TrackingService;
import com.tcs.dhv.validation.TrackingCodeValidator;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tracking")
public class TrackingController {
    private final TrackingService trackingService;
    private final TrackingCodeValidator trackingCodeValidator;
    private final ParcelStatusHistoryService parcelStatusHistoryService;
    private final ParcelRepository parcelRepository;

    public TrackingController(
            TrackingService trackingService,
            TrackingCodeValidator trackingCodeValidator,
            ParcelStatusHistoryService parcelStatusHistoryService,
            ParcelRepository parcelRepository
    ) {
        this.trackingService = trackingService;
        this.trackingCodeValidator = trackingCodeValidator;
        this.parcelStatusHistoryService = parcelStatusHistoryService;
        this.parcelRepository = parcelRepository;
    }

    @GetMapping("/{trackingCode}")
    public ResponseEntity<TrackingResponse> trackParcel(@PathVariable String trackingCode) {
        if (!trackingCodeValidator.isValid(trackingCode, null)) {
            return ResponseEntity.badRequest().body(new TrackingResponse(null,
                    "Invalid tracking code format",
                    Optional.empty(),
                    List.of()));
        }
        TrackingRequest request = new TrackingRequest(trackingCode);
        TrackingResponse response = trackingService.getTrackingDetails(request);
        if (response == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{trackingCode}/timeline")
    public ResponseEntity<List<ParcelStatusHistoryDto>> getParcelTimeline(@PathVariable String trackingCode) {
        if (!trackingCodeValidator.isValid(trackingCode, null)) {
            return ResponseEntity.badRequest().build();
        }
        var parcelOpt = parcelRepository.findByTrackingCode(trackingCode);
        if (parcelOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        var timeline = parcelStatusHistoryService.getParcelTimeline(parcelOpt.get().getId());
        return ResponseEntity.ok(timeline);
    }
}
