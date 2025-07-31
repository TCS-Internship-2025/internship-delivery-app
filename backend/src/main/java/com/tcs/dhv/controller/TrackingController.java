package com.tcs.dhv.controller;


import com.tcs.dhv.domain.dto.TrackingResponse;
import com.tcs.dhv.service.TrackingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/tracking")
public class TrackingController {

    private final TrackingService trackingService;

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
}
