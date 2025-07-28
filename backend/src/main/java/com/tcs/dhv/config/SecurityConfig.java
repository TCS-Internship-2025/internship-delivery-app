package com.tcs.dhv.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.SessionManagementConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.server.resource.web.BearerTokenAuthenticationEntryPoint;
import org.springframework.security.oauth2.server.resource.web.access.BearerTokenAccessDeniedHandler;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.web.cors.CorsConfigurationSource;

import static org.springframework.security.config.Customizer.withDefaults;

@EnableWebSecurity
@RequiredArgsConstructor
@Configuration
public class SecurityConfig {

    public static final String[] PUBLIC_ENDPOINTS = {
        "/api/auth/**",
        "/api/tracking/**"
    };

    @Bean
    public SecurityFilterChain securityFilterChain(
            final HttpSecurity http,
            CorsConfigurationSource corsConfigurationSource) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource))
            .csrf(csrf -> csrf
                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                .ignoringRequestMatchers(PUBLIC_ENDPOINTS)
            )
            .authorizeHttpRequests(auth -> {
                auth.requestMatchers(PUBLIC_ENDPOINTS).permitAll();
                auth.anyRequest().authenticated();
            })
            .sessionManagement(SecurityConfig::getSessionManagementConfig)
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(withDefaults())
                .authenticationEntryPoint(new BearerTokenAuthenticationEntryPoint())
                .accessDeniedHandler(new BearerTokenAccessDeniedHandler())
            );

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(
        final AuthenticationConfiguration configuration
    ) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    private static void getSessionManagementConfig(
        final SessionManagementConfigurer<HttpSecurity> session
    ) {
        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS);
    }
}