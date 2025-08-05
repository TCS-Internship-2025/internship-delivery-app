package com.tcs.dhv.service;

import com.tcs.dhv.domain.entity.PasswordResetToken;
import com.tcs.dhv.repository.ResetTokenRepository;
import com.tcs.dhv.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;

@Slf4j
@RequiredArgsConstructor
@Service
public class PasswordResetService {

    private final ResetTokenRepository resetTokenRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    @Value("${auth.reset-token-ttl}")
    private Duration resetTokenTtl;

    @Value("${dhv.client-url}")
    private String clientUrl;

    private static final SecureRandom secureRandom = new SecureRandom();
    private static final Base64.Encoder encoder = Base64.getUrlEncoder().withoutPadding();

    private String generateSecureToken() {
        final var randomBytes = new byte[32];
        secureRandom.nextBytes(randomBytes);
        return encoder.encodeToString(randomBytes);
    }

    @Transactional
    public void sendResetToken(final String email) {
        userRepository.findByEmail(email)
            .ifPresent(user -> {
                resetTokenRepository.deleteByUserId(user.getId());

                final var token = generateSecureToken();
                final var expiry = Instant.now().plus(resetTokenTtl);

                final var resetToken = PasswordResetToken.builder()
                    .token(token)
                    .user(user)
                    .expiresAt(expiry)
                    .build();

                resetTokenRepository.save(resetToken);

                final var resetLink = "%s/reset-password?token=%s".formatted(clientUrl, token);
                emailService.sendPasswordResetEmail(user.getEmail(), resetLink);

                log.info("Password reset email sent to {}", user.getEmail());
            });
    }

    @Transactional
    public void resetPassword(
        final String token,
        final String newPassword
    ) {
        final var resetToken = resetTokenRepository.findByToken(token)
            .orElseThrow(() -> new IllegalArgumentException("Invalid or expired password reset token"));

        if (resetToken.getExpiresAt().isBefore(Instant.now())) {
            throw new IllegalArgumentException("Password reset token has expired");
        }

        final var user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        resetTokenRepository.delete(resetToken);

        log.info("Password reset successfully for user: {}", user.getEmail());
    }
}
