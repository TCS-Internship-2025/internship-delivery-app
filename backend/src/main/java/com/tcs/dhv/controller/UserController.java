package com.tcs.dhv.controller;

import com.tcs.dhv.domain.dto.UserProfileDto;
import com.tcs.dhv.service.UserService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RequiredArgsConstructor
@RequestMapping(path = "/api/users")
@RestController
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserProfileDto> getCurrentUserProfile(
        final Authentication authentication){
        log.info("Retrieving profile for user: {}", authentication.getName());

        final var profile = userService.getUserProfile(authentication.getName());

        log.info("Retrieved profile for user: {}", authentication.getName());
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/me")
    public ResponseEntity<UserProfileDto> updateCurrentUserProfile(
        final Authentication authentication,
        @Valid @RequestBody final UserProfileDto updateRequest
    ) {
        log.info("Updating profile for user: {}", authentication.getName());

        final var updateProfile = userService.updateUserProfile(authentication.getName(), updateRequest);

        log.info("Updated profile for user: {}", authentication.getName());
        return ResponseEntity.ok(updateProfile);
    }
}
