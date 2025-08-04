package com.tcs.dhv.controller;

import com.tcs.dhv.config.openapi.ApiResponseAnnotations;
import com.tcs.dhv.domain.dto.ApiErrorResponse;
import com.tcs.dhv.domain.dto.AuthResponse;
import com.tcs.dhv.domain.dto.LoginRequest;
import com.tcs.dhv.domain.dto.RegisterRequest;
import com.tcs.dhv.domain.dto.RegisterResponse;
import com.tcs.dhv.service.AuthService;
import com.tcs.dhv.service.EmailService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
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


@Tag(name= "Authentication", description = "User authentication and authorization operations")
@ApiResponseAnnotations.CommonErrorResponse
@Slf4j
@RequiredArgsConstructor
@RequestMapping(path = "/api/auth")
@RestController
public class AuthController {

    private final AuthService authService;
    //private final EmailVerificationService emailVerificationService;
    private final EmailService emailService;

    @Value("${email-verification.required}")
    private boolean emailVerificationRequired;

    @Operation(summary = "Login user", description = "Authenticate user with email and password")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User logged in successfully",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
        @ApiResponse(responseCode = "401", description = "Invalid credentials",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    @ApiResponseAnnotations.ValidationApiResponse
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody final LoginRequest loginRequest) {
        log.info("Login request for email: {}", loginRequest.email());
        final var authResponse = authService.authenticate(loginRequest);

        log.info("Login successful for email: {}", loginRequest.email());
        return ResponseEntity.ok(authResponse);
    }

    @Operation(summary = "Register user", description = "Register user")
    @ApiResponse(responseCode = "201", description = "User registered successfully",
        content = @Content(schema = @Schema(implementation = RegisterResponse.class)))
    @ApiResponseAnnotations.ValidationApiResponse
    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> registerUser(
        @Valid @RequestBody final RegisterRequest registerRequest
    ) {
        log.info("Register request for email: {}", registerRequest.email());
        final var registeredUser = authService.registerUser(registerRequest);

        if (emailVerificationRequired) {
            emailService.sendVerificationTokenByEmail(
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

    @Operation(summary = "Resend verification", description = "Resend the email verification")
    @ApiResponse(responseCode = "204", description = "Verification email sent successfully")
    @ApiResponseAnnotations.NotFoundApiResponse
    @PostMapping("/email/resend-verification")
    public ResponseEntity<Void> resendVerificationEmail(@RequestParam final String email) {
        log.info("Resend verification email requested for: {}", email);
        emailService.resendVerificationTokenByEmail(email);

        log.info("Verification email successfully sent to: {}", email);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Email verification", description = "Verify user by the email")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User verified"),
        @ApiResponse(responseCode = "410", description = "Verification token expired",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    @ApiResponseAnnotations.NotFoundApiResponse
    @GetMapping("/email/verify")
    public ResponseEntity<RegisterResponse> verifyEmail(
        @RequestParam("uid") final UUID userId,
        @RequestParam("t") final String token
    ) {
        final var verifiedUser = emailService.verifyEmail(userId, token);

        log.info("User with email {} successfully verified", verifiedUser.getEmail());
        return ResponseEntity.ok(new RegisterResponse(
            verifiedUser.getName(),
            verifiedUser.getEmail(),
            verifiedUser.getIsVerified()
        ));
    }


    @Operation(summary = "Refresh token", description = "Refresh token")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Token refreshed successfully",
            content = @Content(schema = @Schema(implementation = AuthResponse.class))),
        @ApiResponse(responseCode = "401", description = "Refresh token expired or invalid",
            content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    @ApiResponseAnnotations.NotFoundApiResponse
    @PostMapping("/refresh-token")
    public ResponseEntity<AuthResponse> refreshToken(@RequestParam final UUID refreshToken) {
        log.info("Refresh token request: {}", refreshToken);
        final var authResponse = authService.refreshToken(refreshToken);
        return ResponseEntity.ok(authResponse);
    }

    @Operation(summary = "Logout user", description = "Logout the user by refresh token id")
    @ApiResponse(responseCode = "204", description = "Logout successful")
    @ApiResponseAnnotations.NotFoundApiResponse
    @PostMapping("/logout")
    public ResponseEntity<Void> revokeToken(@RequestParam final UUID refreshToken) {
        log.info("Logout request revoking token: {}", refreshToken);
        authService.revokeToken(refreshToken);
        return ResponseEntity.noContent().build();
    }
}