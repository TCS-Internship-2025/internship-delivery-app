package com.tcs.dhv.domain.dto;

public record RegisterResponse(
    String name,
    String password,
    boolean emailVerificationRequired
) {
}