package com.tcs.dhv.domain.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import java.util.UUID;

@Schema(description = "Authentication response with JWT tokens")
@Builder
public record AuthResponse(
    @Schema(description = "JWT access token")
    String token,

    @Schema(description = "refresh token")
    UUID refreshToken
) {
}
