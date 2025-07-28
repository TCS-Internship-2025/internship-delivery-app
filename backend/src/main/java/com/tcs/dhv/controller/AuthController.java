package com.tcs.dhv.controller;

import com.tcs.dhv.domain.dto.AuthResponse;
import com.tcs.dhv.domain.dto.LoginRequest;
import com.tcs.dhv.domain.dto.RegisterRequest;
import com.tcs.dhv.domain.dto.RegisterResponse;
import com.tcs.dhv.service.AuthService;
import com.tcs.dhv.service.EmailVerificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@RequestMapping(path = "/api/auth")
@RestController
public class AuthController {

    private final AuthService authService;
    private final EmailVerificationService emailVerificationService;

    @Value("${email-verification.required}")
    private boolean emailVerificationRequired;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody final LoginRequest loginRequest) {
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

        if (emailVerificationRequired) {
            emailVerificationService.sendVerificationTokenByEmail(
                registeredUser.getId(),
                registeredUser.getEmail()
            );
        }

        log.info("Register successful for email: {}", registerRequest.email());
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(new RegisterResponse(
                registeredUser.getName(),
                registeredUser.getEmail(),
                registeredUser.getIsVerified()
            ));
    }

    @PostMapping("/email/resend-verification")
    public ResponseEntity<Void> resendVerificationEmail(@RequestParam final String email) {
        log.info("Resend verification email requested for: {}", email);
        emailVerificationService.resendVerificationTokenByEmail(email);

        log.info("Verification email successfully sent to: {}", email);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/email/verify")
    public ResponseEntity<RegisterResponse> verifyEmail(
        @RequestParam("uid") UUID userId,
        @RequestParam("t") String token
    ) {
        final var verifiedUser = emailVerificationService.verifyEmail(userId, token);

        log.info("User with email {} successfully verified", verifiedUser.getEmail());
        return ResponseEntity.ok(new RegisterResponse(
            verifiedUser.getName(),
            verifiedUser.getEmail(),
            verifiedUser.getIsVerified()
        ));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<AuthResponse> refreshToken(@RequestParam UUID refreshToken) {
        log.info("Refresh token request: {}", refreshToken);
        AuthResponse authResponse = authService.refreshToken(refreshToken);
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> revokeToken(@RequestParam UUID refreshToken) {
        log.info("Logout request revoking token: {}", refreshToken);
        authService.revokeToken(refreshToken);
        return ResponseEntity.noContent().build();
    }
}