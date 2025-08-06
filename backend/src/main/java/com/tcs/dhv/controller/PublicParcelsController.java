package com.tcs.dhv.controller;


import com.tcs.dhv.domain.dto.StatusUpdateDto;
import com.tcs.dhv.service.ParcelService;
import com.tcs.dhv.validation.TrackingCode;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/public-api/parcels")
@RestController
public class PublicParcelsController {

    private final ParcelService parcelService;

    @PostMapping("/{trackingCode}/status")
    public ResponseEntity<?> updateParcelStatus(
            @PathVariable @TrackingCode @NotNull String trackingCode,
            @RequestBody StatusUpdateDto  statusUpdateDto
    ) {
        log.info("Incoming status update request for: {}", trackingCode);

        parcelService.updateParcelStatus(trackingCode, statusUpdateDto);
        return ResponseEntity.ok().build();
    }
}
