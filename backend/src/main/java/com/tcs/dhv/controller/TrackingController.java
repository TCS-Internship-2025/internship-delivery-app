package com.tcs.dhv.controller;

import com.tcs.dhv.domain.dto.TrackingRequest;
import com.tcs.dhv.domain.dto.TrackingResponse;
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

    public TrackingController(TrackingService trackingService, TrackingCodeValidator trackingCodeValidator) {
        this.trackingService = trackingService;
        this.trackingCodeValidator = trackingCodeValidator;
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
}
