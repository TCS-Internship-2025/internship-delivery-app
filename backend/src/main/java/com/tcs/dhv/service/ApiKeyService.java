package com.tcs.dhv.service;

import com.tcs.dhv.domain.entity.ApiKey;
import com.tcs.dhv.repository.ApiKeyRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ApiKeyService {

    private final ApiKeyRepository apiKeyRepository;
    private final PasswordEncoder passwordEncoder;

    public Map<String, Object> createApiKey(String name) {
        final var rawKey = UUID.randomUUID().toString().replaceAll("-", "");
        final var hashedKey = passwordEncoder.encode(rawKey);

        final var apiKey = ApiKey.builder()
            .id(UUID.randomUUID())
            .name(name)
            .hashedKey(hashedKey)
            .createdAt(LocalDateTime.now())
            .active(true)
            .build();

        apiKeyRepository.save(apiKey);


        return Map.of(
            "apiKey", rawKey,
            "record", apiKey
        );
    }

    public Optional<ApiKey> validate(String rawKey) {
        if (rawKey == null || rawKey.isBlank()) {
            System.out.println("Key is blank");
            return Optional.empty();
        }

        var activeKeys = apiKeyRepository.findAllByActiveTrue();

        for (ApiKey apiKey : activeKeys) {
            boolean match = passwordEncoder.matches(rawKey, apiKey.getHashedKey());
            System.out.println("Comparing to: " + apiKey.getName());
            System.out.println("Match result: " + match);
        }

        return activeKeys.stream()
            .filter(apiKey -> passwordEncoder.matches(rawKey, apiKey.getHashedKey()))
            .findFirst();
    }


    @Transactional
    public void updateLastUsed(ApiKey apiKey) {
        apiKey.setLastUpdated(LocalDateTime.now());
        apiKeyRepository.save(apiKey);
    }

}
