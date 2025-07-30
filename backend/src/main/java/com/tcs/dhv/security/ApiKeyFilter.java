package com.tcs.dhv.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class ApiKeyFilter extends OncePerRequestFilter {

    @Value("${api.key.header.name:API-KEY}")
    private String apiKeyHeaderName;

    @Value("${api.key.secret}")
    private String apiKeySecret;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI();

        // Only apply this filter to /api/tracking/**
        if (!path.startsWith("/api/testing")) {
            filterChain.doFilter(request, response);
            return;
        }

        String apiKey = request.getHeader(apiKeyHeaderName);
        if (apiKeySecret.equals(apiKey)) {
            // Optionally, you can set authentication in the security context
            SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("apiKeyUser", null, List.of())
            );
            filterChain.doFilter(request, response);
        } else {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Invalid API Key");
        }
    }
}
