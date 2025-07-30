package com.tcs.dhv.controller;

import com.tcs.dhv.domain.entity.ApiKey;
import com.tcs.dhv.service.ApiKeyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/testing")
@RequiredArgsConstructor
public class TestController {


    @GetMapping("/{trackingId}")
    public ResponseEntity<String> getTrackingInfo(@PathVariable String trackingId) {
        return ResponseEntity.ok("Tracking info for ID: " + trackingId);
    }
}
