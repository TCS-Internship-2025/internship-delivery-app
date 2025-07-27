package com.tcs.dhv.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OtpService {

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();
    private final RedisTemplate<String, String> redisTemplate;

    public String generateAndStoreOtp(final UUID id) {
        final var otp = generateOtp("ABCDEFG123456789", 10);
        final var casheKey = getCacheKey(id);

        redisTemplate.opsForValue().set(
            casheKey, otp, Duration.ofMinutes(5)
        );

        return otp;
    }

    public boolean isOtpValid(final UUID id, final String otp) {
        final var casheKey = getCacheKey(id);
        return Objects.equals(
            redisTemplate.opsForValue().get(casheKey),
            otp
        );
    }

    public void deleteOtp(final UUID id) {
        final var casheKey = getCacheKey(id);
        redisTemplate.delete(casheKey);
    }

    private String getCacheKey(final UUID id) {
        return "otp:%s".formatted(id);
    }

    private String generateOtp(String characters, Integer length) {
        StringBuilder otp = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            int index = SECURE_RANDOM.nextInt(characters.length());
            otp.append(characters.charAt(index));
        }
        return otp.toString();
    }
}
