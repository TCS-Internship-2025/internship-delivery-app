package com.tcs.dhv.service;

import com.tcs.dhv.domain.dto.UserProfileDto;
import com.tcs.dhv.domain.entity.User;
import com.tcs.dhv.repository.AddressRepository;
import com.tcs.dhv.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final PasswordEncoder passwordEncoder;

    @Cacheable(value = "users", key = "#userIdentifier")
    public UserProfileDto getUserProfile(final String userIdentifier) {
        final var userId = UUID.fromString(userIdentifier);
        final var user = getUserById(userId);

        return UserProfileDto.fromEntity(user);
    }

    @Transactional
    @CachePut(value = "users", key = "#userIdentifier")
    public UserProfileDto updateUserProfile(
        final String userIdentifier,
        final UserProfileDto updateRequest
    ) {
        log.info("UserIdentifier: {}", userIdentifier);
        final var userId = UUID.fromString(userIdentifier);
        log.info("Retrieving this user's profile by ID: {}", userId);
        final var user = getUserById(userId);
        //log.info("Retrieving user profile: {}", user);


        if(updateRequest.currentPassword() != null ||
        updateRequest.newPassword() != null
        ) {
            handlePasswordUpdate(user, updateRequest);
        }


        if(updateRequest.email() != null &&
            !user.getEmail().equals(updateRequest.email()) &&
            userRepository.existsByEmail(updateRequest.email())
        ) {
            throw new ValidationException("Email already exists");
        }

        if(updateRequest.address() !=null && user.getAddress() == null) {
            final var newAddress = updateRequest.address().toEntity();
            final var savedAddress = addressRepository.save(newAddress);
            user.setAddress(savedAddress);
            log.info("Created and saved new address: {}", savedAddress);
        }

        updateRequest.updateEntity(user);
        user.setUpdatedAt(LocalDateTime.now());

        final var savedUser = userRepository.saveAndFlush(user);
        log.info("3.Profile updated for user ID: {}", savedUser.getId());
        return UserProfileDto.fromEntity(savedUser);
    }

    @Transactional
    @CacheEvict(value = "users", key = "#userId", beforeInvocation = true)
    public void deleteUserProfile(final UUID userId) {
        final var user = userRepository.findById(userId)
            .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));
        userRepository.delete(user);
    }

    public User getUserById(final UUID userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));
    }

    private void handlePasswordUpdate(final User user, final UserProfileDto updateRequest) {
        if(updateRequest.currentPassword() == null || updateRequest.currentPassword().isBlank()) {
            throw new ValidationException("Current password is required");
        }

        if(updateRequest.newPassword() == null || updateRequest.newPassword().isBlank()) {
            throw new ValidationException("New password required");
        }

        if(!passwordEncoder.matches(updateRequest.currentPassword(), user.getPassword())) {
            throw new ValidationException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(updateRequest.newPassword()));
        log.info("Password updated for user ID: {}", user.getId());
    }
}
