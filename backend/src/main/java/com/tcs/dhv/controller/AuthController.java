package com.tcs.dhv.controller;

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
@ApiResponses({
    @ApiResponse(responseCode = "400", description = "Invalid input data",
        content = @Content(
            mediaType = "application/json",
            schema = @Schema(implementation = ApiErrorResponse.class)
        )),
    @ApiResponse(responseCode = "500", description = "Internal server error",
        content = @Content(
            mediaType = "application/json",
            schema = @Schema(implementation = ApiErrorResponse.class)
        ))
})
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
        @ApiResponse(responseCode = "200", description = "Login successful",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = AuthResponse.class))),
        @ApiResponse(responseCode = "401", description = "Invalid credentials",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiErrorResponse.class))),
        @ApiResponse(responseCode = "422", description = "Validation failed",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiErrorResponse.class))),
    })
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody final LoginRequest loginRequest) {
        log.info("Login request for email: {}", loginRequest.email());
        final var authResponse = authService.authenticate(loginRequest);

        log.info("Login successful for email: {}", loginRequest.email());
        return ResponseEntity.ok(authResponse);
    }

    @Operation(summary = "Register user", description = "Register user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "User registered successfully",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = RegisterResponse.class))),
        @ApiResponse(responseCode = "409", description = "Invalid credentials",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiErrorResponse.class))),
        @ApiResponse(responseCode = "422", description = "Validation failed",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiErrorResponse.class))),
    })
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
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Verification email sent successfully"),
        @ApiResponse(responseCode = "404", description = "User not found",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    @PostMapping("/email/resend-verification")
    public ResponseEntity<Void> resendVerificationEmail(@RequestParam final String email) {
        log.info("Resend verification email requested for: {}", email);
        emailService.resendVerificationTokenByEmail(email);

        log.info("Verification email successfully sent to: {}", email);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Email verification", description = "Verify user by the email")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Email verified successfully",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = RegisterResponse.class)
            )),
        @ApiResponse(responseCode = "404", description = "User or verification token not found",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiErrorResponse.class)
            )),
        @ApiResponse(responseCode = "410", description = "Verification token expired",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiErrorResponse.class)
            ))
    })
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
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = AuthResponse.class)
            )),
        @ApiResponse(responseCode = "401", description = "Refresh token expired or invalid",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiErrorResponse.class)
            )),
        @ApiResponse(responseCode = "404", description = "Refresh token not found",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiErrorResponse.class)
            ))
    })
    @PostMapping("/refresh-token")
    public ResponseEntity<AuthResponse> refreshToken(@RequestParam final UUID refreshToken) {
        log.info("Refresh token request: {}", refreshToken);
        final var authResponse = authService.refreshToken(refreshToken);
        return ResponseEntity.ok(authResponse);
    }

    @Operation(summary = "Logout user", description = "Logout the user by refresh token id")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Logout successful"),
        @ApiResponse(responseCode = "404", description = "Refresh token not found",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiErrorResponse.class)
            ))
    })
    @PostMapping("/logout")
    public ResponseEntity<Void> revokeToken(@RequestParam final UUID refreshToken) {
        log.info("Logout request revoking token: {}", refreshToken);
        authService.revokeToken(refreshToken);
        return ResponseEntity.noContent().build();
    }
}