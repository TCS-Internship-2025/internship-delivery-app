package com.tcs.dhv.security;

import com.tcs.dhv.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class DhvUserDetailsService implements UserDetailsService {

    @Value("${email-verification.required}")
    private boolean emailVerificationRequired;

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(final String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
            .map(user -> {
                if (emailVerificationRequired && !user.getIsVerified()) {
                    throw new IllegalStateException("Email is not verified");
                }

            return User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .build();
            }).orElseThrow(() -> new UsernameNotFoundException(
            "User with username [%s] not found".formatted(email)
            ));
    }
}
