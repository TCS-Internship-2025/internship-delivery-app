package com.tcs.dhv.service;

import com.tcs.dhv.domain.dto.AuthResponse;
import com.tcs.dhv.domain.dto.LoginRequest;
import com.tcs.dhv.domain.dto.RegisterRequest;
import com.tcs.dhv.domain.entity.RefreshToken;
import com.tcs.dhv.domain.entity.User;
import com.tcs.dhv.repository.RefreshTokenRepository;
import com.tcs.dhv.repository.UserRepository;
import com.tcs.dhv.security.JwtService;
import jakarta.transaction.Transactional;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.time.Instant;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final RefreshTokenRepository refreshTokenRepository;

    @Value("${auth.refresh-token-ttl}")
    private Duration refreshTokenTtl;

    public AuthResponse authenticate(final LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginRequest.email(),
                loginRequest.password())
        );

        final var email = authentication.getName();
        final var token = jwtService.generateToken(loginRequest.email());

        final var user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email"));

        final var refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setExpiresAt(Instant.now().plus(refreshTokenTtl));
        refreshTokenRepository.save(refreshToken);

        return new AuthResponse(token, refreshToken.getId());
    }

    @Transactional
    public User registerUser(RegisterRequest registerRequest) {
        if (userRepository.existsByName(registerRequest.name()) ||
            userRepository.existsByEmail(registerRequest.email())
        ) {
            throw new ValidationException("Username or Email already exists");
        }

        final var user = User.builder()
            .email(registerRequest.email())
            .name(registerRequest.name())
            .password(passwordEncoder.encode(registerRequest.password()))
            .build();

        return userRepository.save(user);
    }

    public AuthResponse refreshToken(UUID refreshToken) {
        final var refreshTokenEntity = refreshTokenRepository
            .findByIdAndExpiresAtAfter(refreshToken, Instant.now())
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Invalid or expired refresh token"));

        final var newToken = jwtService.generateToken(refreshTokenEntity.getUser().getEmail());
        return new AuthResponse(newToken, refreshTokenEntity.getId());
    }

    public void revokeToken(UUID refreshToken) {
        refreshTokenRepository.deleteById(refreshToken);
    }
}
