package com.tcs.dhv.repository;

import com.tcs.dhv.domain.entity.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ResetTokenRepository extends JpaRepository<PasswordResetToken, UUID> {
    void deleteByUserId(UUID userId);
}
