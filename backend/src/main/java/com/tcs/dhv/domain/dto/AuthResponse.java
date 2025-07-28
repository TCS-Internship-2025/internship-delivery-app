package com.tcs.dhv.domain.dto;

import lombok.Builder;

import java.util.UUID;

@Builder
public record AuthResponse(
    String token,
    UUID refreshToken
) {
}