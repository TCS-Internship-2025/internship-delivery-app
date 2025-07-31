package com.tcs.dhv.service;

import com.tcs.dhv.domain.dto.UserProfileDto;
import com.tcs.dhv.domain.entity.User;
import com.tcs.dhv.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserProfileDto getUserProfile(final String userEmail) {
        final var user = getUserByEmail(userEmail);

        return UserProfileDto.fromEntity(user);
    }

    @Transactional
    public UserProfileDto updateUserProfile(
        final String userIdentifier,
        final UserProfileDto updateRequest
    ) {
        final var user = getUserByEmail(userIdentifier);

        if(!user.getEmail().equals(updateRequest.email()) &&
            userRepository.existsByEmail(updateRequest.email())
        ) {
            throw new ValidationException("Email already exists");
        }

        user.setName(updateRequest.name());
        user.setEmail(updateRequest.email());
        user.setPhone(updateRequest.phone());
        user.setUpdatedAt(LocalDateTime.now());

        final var savedUser = userRepository.save(user);
        return UserProfileDto.fromEntity(savedUser);
    }

    private User getUserByEmail(final String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new EntityNotFoundException("User not found with email: " + email));
    }
}
