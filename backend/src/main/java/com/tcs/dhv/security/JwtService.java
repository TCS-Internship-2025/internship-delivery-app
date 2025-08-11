package com.tcs.dhv.security;

import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import java.time.Duration;
import java.time.Instant;
import java.util.UUID;

@RequiredArgsConstructor
public class JwtService {

    private final String issuer;
    private final Duration ttl;
    private final JwtEncoder jwtEncoder;

    public String generateToken(
        final String email,
        final UUID userUUID,
        final String name,
        final boolean emailVerified
    ) {
        final var claimsSet = JwtClaimsSet.builder()
            .subject(String.valueOf(userUUID))
            .issuer(issuer)
            .expiresAt(Instant.now().plus(ttl))
            .claims(claims -> {
                claims.put("name", name);
                claims.put("email", email);
                claims.put("emailVerified", emailVerified);
            })
            .build();

        return jwtEncoder.encode(JwtEncoderParameters.from(claimsSet))
            .getTokenValue();
    }
}
