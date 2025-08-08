package com.tcs.dhv.config.openapi;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.models.Operation;
import io.swagger.v3.oas.models.Paths;
import io.swagger.v3.oas.models.responses.ApiResponse;
import io.swagger.v3.oas.models.responses.ApiResponses;
import org.springdoc.core.customizers.OpenApiCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;
import java.util.Map;

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
@Configuration
public class OpenApiConfig {

    private static final Map<String, String> COMMON_RESPONSES = Map.of(
        "400", "Bad Request",
        "401", "Unauthorized",
        "403", "Forbidden",
        "500", "Internal Server Error"
    );

    private static void addIfAbsent(final ApiResponses responses, final String code, final String description) {
        if (!responses.containsKey(code)) {
            responses.addApiResponse(code, new ApiResponse().description(description));
        }
    }

    private static void addCommonResponses(final Operation operation) {
        COMMON_RESPONSES.forEach((code, desc) ->
            addIfAbsent(operation.getResponses(),code,desc));
    }

    @Bean
    public OpenApiCustomizer globalResponses() {
        return openApi -> openApi.getPaths().values().forEach(pathItem ->
            pathItem.readOperationsMap().forEach((method, operation) -> {
                switch (method) {
                    case POST -> addIfAbsent(operation.getResponses(),"201", "Created");
                    case PUT, PATCH -> {
                        addIfAbsent(operation.getResponses(), "200", "OK");
                        addIfAbsent(operation.getResponses(), "204", "No content");
                        addIfAbsent(operation.getResponses(), "404", "Accepted");
                    }
                    case DELETE -> {
                        addIfAbsent(operation.getResponses(),"204", "No Content");
                        addIfAbsent(operation.getResponses(),"404", "Not Found");
                    }
                    case GET -> {
                        addIfAbsent(operation.getResponses(), "200", "OK");
                        addIfAbsent(operation.getResponses(), "404", "Not found");
                    }
                    default -> addIfAbsent(operation.getResponses(), "200", "OK");

                }
                addCommonResponses(operation);
            })
        );
    }

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

            openApi.getPaths().forEach((path, pathItem) -> {
                if (!reorderedPaths.containsKey(path)) {
                    reorderedPaths.addPathItem(path, pathItem);
                }
            });

            openApi.setPaths(reorderedPaths);
        };
    }
}