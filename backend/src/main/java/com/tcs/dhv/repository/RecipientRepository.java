package com.tcs.dhv.repository;

import com.tcs.dhv.domain.entity.Recipient;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RecipientRepository extends JpaRepository<Recipient, Long> {
    @EntityGraph(attributePaths = {"address"})
    Optional<Recipient> findByEmail(String email);
}
