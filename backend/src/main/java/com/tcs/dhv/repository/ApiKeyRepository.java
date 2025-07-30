package com.tcs.dhv.repository;

import com.tcs.dhv.domain.entity.ApiKey;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ApiKeyRepository extends CrudRepository<ApiKey, Integer> {
    List<ApiKey> findAllByActiveTrue();
}
