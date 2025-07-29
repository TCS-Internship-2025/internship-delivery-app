package com.tcs.dhv.security;

import com.tcs.dhv.domain.entity.ApiKey;
import com.tcs.dhv.repository.ApiKeyRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RequiredArgsConstructor
public class ApiKeyService {

    private final ApiKeyRepository apiKeyRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();

    public Map<String, Object> createApiKey(String name){
        final var rawKey = UUID.randomUUID().toString().replaceAll("-", "");
        final var hashed = bCryptPasswordEncoder.encode(rawKey);

        final var apiKey = ApiKey.builder()
            .id(UUID.randomUUID())
            .name(name)
            .hashedKey(hashed)
            .createdAt(LocalDateTime.now())
            .active(true)
            .build();

        apiKeyRepository.save(apiKey);

        return Map.of(
            "apiKey", rawKey,
            "record", apiKey
        );
    }

    public ApiKey matchIncomingApiKey(String rawKey){

        final var bCryptPasswordEncoder = new BCryptPasswordEncoder();
        List<ApiKey> activeKeys = apiKeyRepository.findAllByActiveTrue();

        for (ApiKey apiKey : activeKeys) {
            if(bCryptPasswordEncoder.matches(rawKey,apiKey.getHashedKey())){
                return apiKey;
            }
        }

        return null;
    }
    @Transactional
    public void updateLastUsed(ApiKey key) {
        key.setLastUsedAt(LocalDateTime.now());
        apiKeyRepository.save(key);
    }
}
