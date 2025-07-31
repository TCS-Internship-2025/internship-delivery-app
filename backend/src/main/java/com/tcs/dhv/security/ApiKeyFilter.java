package com.tcs.dhv.security;

import com.tcs.dhv.service.ApiKeyService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
@Slf4j
@RequiredArgsConstructor
public class ApiKeyFilter extends OncePerRequestFilter {

    private final ApiKeyService apiKeyService;

    @Value("${api.key.header.name}")
    private String apiKeyHeaderName;

    @Override
    protected void doFilterInternal(
        final HttpServletRequest request,
        final HttpServletResponse response,
        final FilterChain filterChain
    ) throws ServletException, IOException {

        final var path = request.getRequestURI();

        if (!path.startsWith("/api/tracking")) {
            log.debug("Skipping API key filter for path: {}", path);
            filterChain.doFilter(request, response);
            return;
        }

        final var rawKey = request.getHeader(apiKeyHeaderName);

        if (rawKey == null || rawKey.isBlank()) {
            log.warn("Missing or blank API Key");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Unauthorized: API Key is missing");
            return;
        }

        if (apiKeyService.validate(rawKey).isPresent()) {
            log.info("API Key validated successfully");
            final var authentication = new UsernamePasswordAuthenticationToken(
                "apiKeyUser", null, Collections.emptyList()
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
            filterChain.doFilter(request, response);
        } else {
            log.warn("Invalid API Key provided");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Unauthorized: Invalid API Key");
        }
    }

}
