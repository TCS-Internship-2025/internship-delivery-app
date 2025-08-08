package com.tcs.dhv.service;

import com.tcs.dhv.domain.entity.ApiKey;
import com.tcs.dhv.repository.ApiKeyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@Service
public class ApiKeyService {

    private final ApiKeyRepository apiKeyRepository;
    private final PasswordEncoder passwordEncoder;

    public Optional<ApiKey> validate(final String rawKey) {
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
