package com.tcs.dhv.repository;

import com.tcs.dhv.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(final String email);

    boolean existsByEmail(final String email);

    boolean existsByName(final String name);
}