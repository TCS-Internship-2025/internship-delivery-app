package com.tcs.dhv.controller;

import com.tcs.dhv.service.ApiKeyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class ApiKeyController {

    private final ApiKeyService apiKeyService;

    @PostMapping("/generate-key")
    public ResponseEntity<Map<String, Object>> generate(@RequestParam String name) {
        return ResponseEntity.ok(apiKeyService.createApiKey(name));
    }
}
