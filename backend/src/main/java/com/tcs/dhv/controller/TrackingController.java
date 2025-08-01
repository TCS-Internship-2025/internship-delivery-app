package com.tcs.dhv.controller;

import com.tcs.dhv.domain.dto.ParcelStatusHistoryDto;
import com.tcs.dhv.domain.dto.TrackingResponse;
import com.tcs.dhv.repository.ParcelRepository;
import com.tcs.dhv.service.ParcelStatusHistoryService;
import com.tcs.dhv.service.TrackingService;
import com.tcs.dhv.validation.TrackingCode;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/tracking")
@RequiredArgsConstructor
@RestController
@Validated
public class TrackingController {


    private final TrackingService trackingService;
    private final ParcelStatusHistoryService parcelStatusHistoryService;
    private final ParcelRepository parcelRepository;

    @GetMapping("/{trackingCode}")
    public ResponseEntity<TrackingResponse> trackParcel(
            @Valid
            @NotNull
            @TrackingCode
            @PathVariable
            String trackingCode
    ) {
        final var response = trackingService.getTrackingDetails(trackingCode);

        if (response == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{trackingCode}/timeline")
    public ResponseEntity<List<ParcelStatusHistoryDto>> getParcelTimeline(
            @Valid
            @NotNull
            @TrackingCode
            @PathVariable
            String trackingCode
    ) {
        final var parcelOpt = parcelRepository.findByTrackingCode(trackingCode);
        if (parcelOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        final var timeline = parcelStatusHistoryService.getParcelTimeline(parcelOpt.get().getId());
        return ResponseEntity.ok(timeline);
    }
}
