package com.tcs.dhv.controller;

import com.tcs.dhv.domain.dto.*;
import com.tcs.dhv.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody @Valid final LoginRequest loginRequest) {
        log.info("Login request for email: {}", loginRequest.email());
        final var authResponse = authService.authenticate(loginRequest);

        log.info("Login successful for email: {}", loginRequest.email());
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> registerUser(
        @Valid @RequestBody final RegisterRequest registerRequest
    ) {
        log.info("Register request for email: {}", registerRequest.email());
        final var registeredUser = authService.registerUser(registerRequest);

        log.info("Register successful for email: {}", registerRequest.email());
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(new RegisterResponse(registeredUser.getName(), registeredUser.getEmail()));
    }
}