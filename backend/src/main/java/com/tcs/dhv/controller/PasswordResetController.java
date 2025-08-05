package com.tcs.dhv.controller;

import com.tcs.dhv.domain.dto.ForgotPasswordDto;
import com.tcs.dhv.domain.dto.ResetPasswordDto;
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

    @PostMapping("/forgot")
    public ResponseEntity<String> requestPasswordReset(
        @Valid @RequestBody ForgotPasswordDto forgotPassword
    ) {
        passwordResetService.sendResetToken(forgotPassword.email());
        return ResponseEntity.ok("If email is registered a reset link will be sent!");
    }

    @PostMapping("/reset")
    public ResponseEntity<String> resetPassword(
        @Valid @RequestBody ResetPasswordDto resetPassword
    ) {
        passwordResetService.resetPassword(resetPassword.token(), resetPassword.newPassword());
        return ResponseEntity.ok("Password has been reset successfully");
    }
}