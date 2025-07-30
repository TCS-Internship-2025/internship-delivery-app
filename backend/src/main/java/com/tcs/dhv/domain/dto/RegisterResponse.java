package com.tcs.dhv.domain.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "User registration request")
public record RegisterResponse(
    @Schema(description = "User's full name", example = "Ferenc Kiss")
    String name,

    @Schema(description = "User's email", example = "ferenckiss19823010@gmail.com")
    String email,
    boolean emailVerificationRequired
) {
}