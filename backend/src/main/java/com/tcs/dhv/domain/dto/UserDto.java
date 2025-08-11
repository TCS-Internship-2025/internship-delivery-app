package com.tcs.dhv.domain.dto;

import com.tcs.dhv.config.openapi.SchemaConstants;
import com.tcs.dhv.domain.entity.User;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Schema(description = "User information")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    @Schema(description = "User id", example = "550e8400-e29b-41d4-a716-446655440000")
    private UUID id;

    @Schema(description = SchemaConstants.NAME_DESC, example = SchemaConstants.NAME_EX)
    private String name;

    @Schema(description = SchemaConstants.EMAIL_DESC, example = SchemaConstants.EMAIL_EX)
    private String email;

    public static UserDto fromEntity(final User user) {
        return UserDto.builder()
            .id(user.getId())
            .name(user.getName())
            .email(user.getEmail())
            .build();
    }
}
