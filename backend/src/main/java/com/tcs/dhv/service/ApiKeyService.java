package com.tcs.dhv.service;

import com.tcs.dhv.domain.entity.ApiKey;
import com.tcs.dhv.repository.ApiKeyRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class ApiKeyService {

    private final ApiKeyRepository apiKeyRepository;
    private final PasswordEncoder passwordEncoder;

    public Optional<ApiKey> validate(String rawKey) {
        if (rawKey == null || rawKey.isBlank()) {
            log.warn("API key is blank or null");
            return Optional.empty();
        }
         return apiKeyRepository.findAllByActiveTrue()
             .stream()
             .filter(apiKey -> passwordEncoder.matches(rawKey, apiKey.getHashedKey()))
             .findFirst();
    }

}
