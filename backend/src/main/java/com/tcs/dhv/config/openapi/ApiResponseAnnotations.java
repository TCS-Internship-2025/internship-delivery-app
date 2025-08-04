package com.tcs.dhv.config.openapi;

import com.tcs.dhv.domain.dto.ApiErrorResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

public class ApiResponseAnnotations {

    @Target({ElementType.TYPE, ElementType.ANNOTATION_TYPE})
    @Retention(RetentionPolicy.RUNTIME)
    @ApiResponse(responseCode = "400", description = "Bad Request",
        content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "500", description = "Internal server error",
        content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    public @interface CommonErrorResponse {}

    @Target({ElementType.METHOD, ElementType.TYPE})
    @Retention(RetentionPolicy.RUNTIME)
    @ApiResponse(responseCode = "404", description = "Resource not found",
        content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    public @interface NotFoundApiResponse {}

    @Target({ElementType.TYPE, ElementType.ANNOTATION_TYPE})
    @Retention(RetentionPolicy.RUNTIME)
    @CommonErrorResponse // 400, 500
    @ApiResponse(responseCode = "401", description = "Authentication required",
        content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "403", description = "Access forbidden",
        content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @SecurityRequirement(name = "bearerAuth")
    public @interface SecureEndpointResponse {}

    @Target({ElementType.METHOD, ElementType.TYPE})
    @Retention(RetentionPolicy.RUNTIME)
    @CommonErrorResponse //400, 500
    @ApiResponse(responseCode = "422", description = "Validation failed",
        content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    public @interface ValidationApiResponse {}
}
