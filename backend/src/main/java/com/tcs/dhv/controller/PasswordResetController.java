package com.tcs.dhv.controller;

import com.tcs.dhv.domain.dto.ForgotPasswordDto;
import com.tcs.dhv.service.PasswordResetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RequestMapping("/api/auth/password")
@RestController
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    @PostMapping("/reset-link")
    public ResponseEntity<String> requestPasswordReset(@Valid @RequestBody ForgotPasswordDto forgotPassword) {
        passwordResetService.sendResetToken(forgotPassword.email());
        return ResponseEntity.ok("If email is registered a reset link will be sent!");
    }
}