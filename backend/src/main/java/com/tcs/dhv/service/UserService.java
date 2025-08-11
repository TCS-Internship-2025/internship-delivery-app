package com.tcs.dhv.service;

import com.tcs.dhv.domain.dto.UserProfileDto;
import com.tcs.dhv.domain.entity.Address;
import com.tcs.dhv.domain.entity.User;
import com.tcs.dhv.domain.enums.ParcelStatus;
import com.tcs.dhv.repository.AddressRepository;
import com.tcs.dhv.repository.ParcelRepository;
import com.tcs.dhv.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.OptimisticLockException;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.dao.ConcurrencyFailureException;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDateTime;
import java.util.EnumSet;
import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final PasswordEncoder passwordEncoder;
    private final ParcelRepository parcelRepository;

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
        try {
            log.info("UserIdentifier: {}", userIdentifier);
            final var userId = UUID.fromString(userIdentifier);
            log.info("Retrieving this user's profile by ID: {}", userId);
            final var user = getUserById(userId);

            if (updateRequest.currentPassword() != null ||
                updateRequest.newPassword() != null
            ) {
                handlePasswordUpdate(user, updateRequest);
            }

            if (updateRequest.email() != null &&
                !user.getEmail().equals(updateRequest.email()) &&
                userRepository.existsByEmail(updateRequest.email())
            ) {
                throw new ValidationException("Email already exists");
            }

            if (updateRequest.phone() != null &&
                !updateRequest.phone().equals(user.getPhone()) &&
                userRepository.existsByPhone(updateRequest.phone())
            ) {
                throw new ValidationException("Phone number already in use by other user");
            }

            if (updateRequest.address() !=null && user.getAddress() == null) {
                final var newAddress = Address.builder()
                    .line1(updateRequest.address().line1())
                    .line2(updateRequest.address().line2())
                    .city(updateRequest.address().city())
                    .postalCode(updateRequest.address().postalCode())
                    .country(updateRequest.address().country())
                    .build();

                final var savedAddress = addressRepository.save(newAddress);

                user.setAddress(savedAddress);

                log.info("Created and saved new address: {}", savedAddress);
            }

            updateRequest.updateEntity(user);
            user.setUpdatedAt(LocalDateTime.now());

            final var savedUser = userRepository.saveAndFlush(user);
            log.info("3.Profile updated for user ID: {}", savedUser.getId());
            return UserProfileDto.fromEntity(savedUser);
        } catch(final OptimisticLockException | ObjectOptimisticLockingFailureException e) {
            log.warn("Optimistic lock occurred while trying to update user's profile: {}", userIdentifier);
            throw new ConcurrencyFailureException("Profile was updated by another session");
        }
    }

    @Transactional
    @CacheEvict(value = "users", key = "#userId", beforeInvocation = true)
    public void deleteUserProfile(final UUID userId) {
        log.info("Request to delete user profile with ID: {}", userId);
        final var user = getUserById(userId);

        final var undeliveredStatus = EnumSet.of(
            ParcelStatus.CREATED,
            ParcelStatus.PICKED_UP,
            ParcelStatus.IN_TRANSIT,
            ParcelStatus.OUT_FOR_DELIVERY,
            ParcelStatus.DELIVERY_ATTEMPTED,
            ParcelStatus.RETURNED_TO_SENDER
        );

        final var hasUndeliveredSentParcels = parcelRepository.existsBySenderIdAndCurrentStatusIn(
            userId,
            undeliveredStatus
        );
        final var hasUndeliveredReceivedParcels = parcelRepository.existsByRecipientIdAndCurrentStatusIn(
            userId,
            undeliveredStatus
        );

        if (hasUndeliveredSentParcels || hasUndeliveredReceivedParcels) {
            log.warn("Attempted to delete user with ID: {} who has undelivered parcels", userId);
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Cannot delete user profile with undelivered parcels"
            );
        }

        log.info("User profile deleted for ID: {}", userId);
        userRepository.delete(user);
    }

    public User getUserById(final UUID userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));
    }

    private void handlePasswordUpdate(
        final User user,
        final UserProfileDto updateRequest
    ) {
        if (updateRequest.currentPassword() == null || updateRequest.currentPassword().isBlank()) {
            throw new ValidationException("Current password is required");
        }

        if (updateRequest.newPassword() == null || updateRequest.newPassword().isBlank()) {
            throw new ValidationException("New password required");
        }

        if (!passwordEncoder.matches(updateRequest.currentPassword(), user.getPassword())) {
            throw new ValidationException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(updateRequest.newPassword()));
        log.info("Password updated for user ID: {}", user.getId());
    }
}
