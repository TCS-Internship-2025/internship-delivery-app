package com.tcs.dhv.domain.dto;

import lombok.Builder;

@Builder
public record AuthResponse(
    String token
) {
}