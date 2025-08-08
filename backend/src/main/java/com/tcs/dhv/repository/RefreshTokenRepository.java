package com.tcs.dhv.repository;

import com.tcs.dhv.domain.entity.RefreshToken;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {
    @EntityGraph(attributePaths = {"user"})
    Optional<RefreshToken> findByIdAndExpiresAtAfter(UUID id, Instant date);
}
