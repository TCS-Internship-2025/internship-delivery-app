package com.tcs.dhv.userProfileTest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tcs.dhv.controller.UserController;
import com.tcs.dhv.domain.dto.AddressDto;
import com.tcs.dhv.domain.dto.UserProfileDto;
import com.tcs.dhv.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ValidationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;

import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UserController.class)
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    private UserProfileDto testUserProfile;
    private UUID userId;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();

        AddressDto testAddress = new AddressDto(
            "Test utca 25",
            "3. emelet",
            null,
            null,
            "Budapest",
            "1117",
            "Hungary",
            null,
            null
        );

        testUserProfile = UserProfileDto.builder()
            .name("Test User")
            .email("test@example.com")
            .phone("+36201234567")
            .address(testAddress)
            .isVerified(true)
            .createdAt(LocalDateTime.now())
            .updatedAt(LocalDateTime.now())
            .build();
    }

    @Test
    @DisplayName("Should return user profile when authenticated")
    @WithMockUser(username = "test-user-id")
    void getUserProfile_Success() throws Exception {
        when(userService.getUserProfile(anyString())).thenReturn(testUserProfile);

        mockMvc.perform(get("/api/users/me")
                .with(user("test-user-id")))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value("Test User"))
            .andExpect(jsonPath("$.email").value("test@example.com"));
    }

    @Test
    @DisplayName("Should return 401 when not authenticated")
    void getUserProfile_Unauthorized() throws Exception {
        mockMvc.perform(get("/api/users/me"))
            .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Should return 404 when user not found")
    @WithMockUser(username = "test-user-id")
    void getUserProfile_UserNotFound() throws Exception {
        when(userService.getUserProfile(anyString()))
            .thenThrow(new EntityNotFoundException("User not found"));

        mockMvc.perform(get("/api/users/me")
                .with(user("test-user-id")))
            .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Should update user profile successfully")
    @WithMockUser(username = "test-user-id")
    void updateUserProfile_Success() throws Exception {
        UserProfileDto updateRequest = UserProfileDto.builder()
            .name("Updated Name")
            .build();

        when(userService.updateUserProfile(anyString(), any(UserProfileDto.class)))
            .thenReturn(testUserProfile);

        mockMvc.perform(put("/api/users/me")
                .with(user("test-user-id"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateRequest)))
            .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Should return 400 for validation errors")
    @WithMockUser(username = "test-user-id")
    void updateUserProfile_ValidationError() throws Exception {
        UserProfileDto updateRequest = UserProfileDto.builder()
            .email("existing@example.com")
            .build();

        when(userService.updateUserProfile(anyString(), any(UserProfileDto.class)))
            .thenThrow(new ValidationException("Email already exists"));

        mockMvc.perform(put("/api/users/me")
                .with(user("test-user-id"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateRequest)))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should delete user profile successfully")
    @WithMockUser(username = "550e8400-e29b-41d4-a716-446655440000")
    void deleteUserProfile_Success() throws Exception {
        doNothing().when(userService).deleteUserProfile(any(UUID.class));

        mockMvc.perform(delete("/api/users/me")
                .with(user("test-user")))
            .andExpect(status().isNoContent());
    }
}
