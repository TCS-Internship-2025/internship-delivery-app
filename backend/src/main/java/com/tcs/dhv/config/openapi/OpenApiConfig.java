package com.tcs.dhv.config.openapi;

import com.tcs.dhv.domain.dto.ApiErrorResponse;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.models.responses.ApiResponse;
import io.swagger.v3.oas.models.media.Content;
import io.swagger.v3.oas.models.media.MediaType;
import io.swagger.v3.oas.models.media.Schema;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.Paths;
import org.springdoc.core.customizers.OpenApiCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.List;

@Configuration
@SecurityScheme(
    name = "Bearer Authentication",
    type = SecuritySchemeType.HTTP,
    scheme = "bearer",
    bearerFormat = "JWT",
    description = """
        # JWT Bearer token authentication.
        
        **How to get a token:**
        1. Register using POST /api/auth/register
        2. Verify email using the link sent to your email
        3. Login using POST /api/auth/login
        4. Copy the 'accessToken' from the response
        5. Enter it here as: Bearer <your-access-token>
        
        **Token format:** Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
        """
)
@OpenAPIDefinition(
    info = @Info(
        title = "DHV Parcel Management API",
        version = "1.0",
        description = """
            This API allows users to manage parcels, and perform authentication operations.
            
            ## Authentication Endpoints
            
            The authentication endpoints is open for everyone.
            
            ## Parcel Endpoints
            
            These endpoints require JWT token authorization to view.
            
            ### **How to get a token:**
                1. Register using POST /api/auth/register
                2. Verify email using the link sent to your email
                3. Login using POST /api/auth/login
                4. Copy the 'accessToken' from the response
                5. Enter it here as: Bearer <your-access-token>
            """
    ),
    security = @SecurityRequirement(name = "bearerAuth")
)
public class OpenApiConfig {

    @Bean
    public OpenApiCustomizer operationOrderCustomizer(){
        return openApi ->{
            final var authOperationOrder = List.of(
                "/api/auth/login",
                "/api/auth/register",
                "/api/auth/logout",
                "/api/auth/email/resend-verification",
                "/api/auth/refresh-token",
                "/api/auth/email/verify"
            );

            final var parcelPaths = List.of(
                "/api/parcels",
                "/api/parcels/{id}"
            );

            final var reorderedPaths = new Paths();

            authOperationOrder.forEach(path -> {
                final var pathItem = openApi.getPaths().get(path);
                if (pathItem != null) {
                    reorderedPaths.addPathItem(path, pathItem);
                }
            });

            parcelPaths.forEach(path -> {
                final var pathItem = openApi.getPaths().get(path);
                if (pathItem != null) {
                    reorderedPaths.addPathItem(path, pathItem);
                }
            });

            // Add any remaining paths
            openApi.getPaths().forEach((path, pathItem) -> {
                if (!reorderedPaths.containsKey(path)) {
                    reorderedPaths.addPathItem(path, pathItem);
                }
            });

            openApi.setPaths(reorderedPaths);
        };
    }
}