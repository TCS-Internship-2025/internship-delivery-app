package com.tcs.dhv.service;

import com.tcs.dhv.domain.dto.AuthResponse;
import com.tcs.dhv.domain.dto.LoginRequest;
import com.tcs.dhv.domain.dto.RegisterRequest;
import com.tcs.dhv.domain.entity.User;
import com.tcs.dhv.repository.UserRepository;
import com.tcs.dhv.security.JwtService;
import jakarta.transaction.Transactional;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthResponse authenticate(final LoginRequest loginRequest) {
        final var authToken = UsernamePasswordAuthenticationToken
            .unauthenticated(loginRequest.email(), loginRequest.password());

        final var authentication = authenticationManager.authenticate(authToken);

        final var token = jwtService.generateToken(loginRequest.email());
        return new AuthResponse(token);
    }

    @Transactional
    public User registerUser(RegisterRequest registerRequest) {
        if (userRepository.existsByName(registerRequest.name()) ||
            userRepository.existsByEmail(registerRequest.email())
        ) {
            throw new ValidationException("Username or Email already exists");
        }

        User user = User.builder()
            .email(registerRequest.email())
            .name(registerRequest.name())
            .password(passwordEncoder.encode(registerRequest.password()))
            .build();

        return userRepository.save(user);
    }
}
