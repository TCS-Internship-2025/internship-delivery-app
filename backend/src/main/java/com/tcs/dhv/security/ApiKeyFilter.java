package com.tcs.dhv.security;

import com.tcs.dhv.repository.ApiKeyRepository;
import com.tcs.dhv.service.ApiKeyService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class ApiKeyFilter extends OncePerRequestFilter {

    private final ApiKeyService apiKeyService;
    @Override
    protected void doFilterInternal(
        final HttpServletRequest request,
        final HttpServletResponse response,
        final FilterChain filterChain
    ) throws ServletException, IOException {
        final var path = request.getRequestURI();

        if (path.startsWith("/api/tracking")){
            final var apiKey = request.getHeader("apiKey");

            final var matchedKey = apiKeyService.validate(apiKey);
            if(matchedKey.isEmpty()){
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Missing apiKey");
                return;
            }

            apiKeyService.updateLastUsed(matchedKey.get());
        }
        filterChain.doFilter(request,response);
    }
}
