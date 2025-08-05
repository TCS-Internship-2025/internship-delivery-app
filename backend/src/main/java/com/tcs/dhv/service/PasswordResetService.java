package com.tcs.dhv.service;

import com.tcs.dhv.domain.entity.PasswordResetToken;
import com.tcs.dhv.repository.ResetTokenRepository;
import com.tcs.dhv.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
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

    @Value("${auth.reset-token-ttl}")
    private Duration resetTokenTtl;

    @Value("${dhv.client-url}")
    private String clientUrl;

    private static final SecureRandom secureRandom = new SecureRandom();
    private static final Base64.Encoder encoder = Base64.getUrlEncoder().withoutPadding();

    private String generateSecureToken() {
        byte[] randomBytes = new byte[32];
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
}
