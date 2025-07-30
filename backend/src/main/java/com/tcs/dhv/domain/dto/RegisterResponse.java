package com.tcs.dhv.domain.dto;

public record RegisterResponse(
    String name,
    String email,
    boolean emailVerificationRequired
) {
}