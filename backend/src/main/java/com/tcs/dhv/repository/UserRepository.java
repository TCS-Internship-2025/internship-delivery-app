package com.tcs.dhv.repository;

import com.tcs.dhv.domain.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    @EntityGraph(attributePaths = {"address", "refreshTokens"})
    Optional<User> findByEmail(final String email);

    @EntityGraph(attributePaths = {"address", "refreshTokens"})
    boolean existsByEmail(final String email);

    boolean existsByPhone(final String phone);
}
