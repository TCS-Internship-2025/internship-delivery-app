package com.tcs.dhv.repository;

import com.tcs.dhv.domain.entity.Recipient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecipientRepository extends JpaRepository<Recipient, Long> {
}
