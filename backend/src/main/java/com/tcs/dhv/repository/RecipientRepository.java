package com.tcs.dhv.repository;

import com.tcs.dhv.domain.entity.Recipient;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface RecipientRepository extends JpaRepository<Recipient, UUID> {
    @EntityGraph(attributePaths = {"address"})
    Optional<Recipient> findByEmail(String email);
}