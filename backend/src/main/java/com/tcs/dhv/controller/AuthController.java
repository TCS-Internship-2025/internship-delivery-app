package com.tcs.dhv.controller;

import com.tcs.dhv.domain.dto.AuthResponse;
import com.tcs.dhv.domain.dto.LoginRequest;
import com.tcs.dhv.domain.dto.RegisterRequest;
import com.tcs.dhv.domain.dto.UserDto;
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
    public ResponseEntity<AuthResponse> login(@RequestBody @Valid LoginRequest loginRequest) {
        final var userDetails = authService.authenticate(
                loginRequest.getEmail(),
                loginRequest.getPassword()
        );

        final var tokenValue = authService.generateToken(userDetails);
        final var authResponse = AuthResponse.builder()
                .token(tokenValue)
                .expiresIn(86400)
                .build();

        log.info("Login successful for email: {}", loginRequest.getEmail());
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/register")
    public ResponseEntity<UserDto> register(@RequestBody @Valid RegisterRequest registerRequest) {
        log.info("Register request for email: {}", registerRequest.getEmail());
        final var created = authService.registerUser(registerRequest);

        log.info("Register successful for email: {}", registerRequest.getEmail());
        return new ResponseEntity<>(created,  HttpStatus.CREATED);
    }
}