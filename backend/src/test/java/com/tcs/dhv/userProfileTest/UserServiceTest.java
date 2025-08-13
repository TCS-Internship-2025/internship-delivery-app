package com.tcs.dhv.userProfileTest;

import com.tcs.dhv.domain.dto.AddressDto;
import com.tcs.dhv.domain.dto.UserProfileDto;
import com.tcs.dhv.domain.entity.Address;
import com.tcs.dhv.domain.entity.User;
import com.tcs.dhv.repository.AddressRepository;
import com.tcs.dhv.repository.UserRepository;
import com.tcs.dhv.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ValidationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private AddressRepository addressRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private UUID userId;
    private User testUser;
    private Address testAddress;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        testAddress = Address.builder()
            .id(UUID.randomUUID())
            .line1("Test utca 25")
            .line2("3. emelet")
            .city("Budapest")
            .postalCode("1117")
            .country("Hungary")
            .build();

        testUser = User.builder()
            .id(userId)
            .name("Test User")
            .email("test@example.com")
            .phone("+36201234567")
            .password("encodedPassword")
            .address(testAddress)
            .isVerified(true)
            .createdAt(LocalDateTime.now())
            .updatedAt(LocalDateTime.now())
            .build();
    }

    @Nested
    @DisplayName("Get User Profile Tests")
    class GetUserProfileTests {

        @Test
        @DisplayName("Should return user profile when user exists")
        void shouldReturnUserProfileWhenUserExists() {
            when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));

            final var result = userService.getUserProfile(userId.toString());

            assertThat(result).isNotNull();
            assertThat(result.name()).isEqualTo("Test User");
            assertThat(result.email()).isEqualTo("test@example.com");
            assertThat(result.phone()).isEqualTo("+36201234567");
            assertThat(result.address()).isNotNull();
            assertThat(result.address().line1()).isEqualTo(testAddress.getLine1());
            assertThat(result.address().city()).isEqualTo(testAddress.getCity());
            assertThat(result.isVerified()).isTrue();

            verify(userRepository).findById(userId);
        }

        @Test
        @DisplayName("Should throw EntityNotFoundException when user does not exist")
        void userDoesNotExist() {
            when(userRepository.findById(userId)).thenReturn(Optional.empty());

            assertThatThrownBy(() ->
                userService.getUserProfile(userId.toString()))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessage("User not found with ID: " + userId);

            verify(userRepository).findById(userId);
        }
    }

    @Nested
    @DisplayName("Update User Profile Tests")
    class UpdateUserProfileTests {

        @Test
        @DisplayName("Should update basic info (name, email, phone) successfully")
        void updateBasicInfo() {
            final var updateRequest = UserProfileDto.builder()
                .name("Updated Name")
                .email("updated@example.com")
                .phone("+36301234568")
                .build();

            when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
            when(userRepository.existsByEmail("updated@example.com")).thenReturn(false);
            when(userRepository.existsByPhone("+36301234568")).thenReturn(false);

            when(userRepository.saveAndFlush(any(User.class))).thenReturn(testUser);

            final var result = userService.updateUserProfile(userId.toString(), updateRequest);

            assertThat(result).isNotNull();
            assertThat(result.name()).isEqualTo("Updated Name");
            assertThat(result.email()).isEqualTo("updated@example.com");
            assertThat(result.phone()).isEqualTo("+36301234568");

            verify(userRepository).findById(userId);
            verify(userRepository).existsByEmail("updated@example.com");
            verify(userRepository).existsByPhone("+36301234568");
            verify(userRepository).saveAndFlush(any(User.class));
        }

        @Test
        @DisplayName("Should update address successfully when user has no existing address")
        void updateAddress() {
            testUser.setAddress(null);

            final var addressDto = new AddressDto(
                "New utca 2",
                "5. emelet",
                null,
                null,
                "Budapest",
                "1118",
                "Hungary",
                null,
                null
            );

            final var updateRequest = UserProfileDto.builder()
                .address(addressDto)
                .build();

            final var newAddress = Address.builder()
                .line1("New utca 2")
                .line2("5. emelet")
                .city("Budapest")
                .postalCode("1118")
                .country("Hungary")
                .build();

            when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
            when(addressRepository.save(any(Address.class))).thenReturn(newAddress);
            when(userRepository.saveAndFlush(any(User.class))).thenReturn(testUser);

            final var result = userService.updateUserProfile(userId.toString(), updateRequest);

            assertThat(result).isNotNull();
            verify(addressRepository).save(any(Address.class));
            verify(userRepository).saveAndFlush(any(User.class));
            assertThat(testUser.getAddress()).isEqualTo(newAddress);
        }

        @Test
        @DisplayName("Should update password successfully")
        void updatePassword() {
            final var updateRequest = UserProfileDto.builder()
                .currentPassword("currentPassword")
                .newPassword("newPassword123!")
                .build();

            when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
            when(passwordEncoder.matches("currentPassword", "encodedPassword")).thenReturn(true);
            when(passwordEncoder.encode("newPassword123!")).thenReturn("newEncodedPassword");
            when(userRepository.saveAndFlush(any(User.class))).thenReturn(testUser);

            final var result = userService.updateUserProfile(userId.toString(), updateRequest);

            assertThat(result).isNotNull();
            verify(passwordEncoder).matches("currentPassword", "encodedPassword");
            verify(passwordEncoder).encode("newPassword123!");
            verify(userRepository).saveAndFlush(any(User.class));
        }

        @Test
        @DisplayName("Should update all fields at once successfully")
        void updateAllFieldsAtOnce() {
            final var addressDto = new AddressDto(
                "789 Complete Street",
                null,
                null,
                null,
                "Szeged",
                "6720",
                "Hungary",
                null,
                null
            );

            final var updateRequest = UserProfileDto.builder()
                .name("Complete Update")
                .email("complete@example.com")
                .phone("36701234567")
                .address(addressDto)
                .currentPassword("currentPassword")
                .newPassword("newCompletePassword123!")
                .build();

            when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
            when(userRepository.existsByEmail("complete@example.com")).thenReturn(false);
            when(userRepository.existsByPhone("36701234567")).thenReturn(false);
            when(passwordEncoder.matches("currentPassword", "encodedPassword")).thenReturn(true);
            when(passwordEncoder.encode("newCompletePassword123!")).thenReturn("newCompleteEncodedPassword");
            when(userRepository.saveAndFlush(any(User.class))).thenReturn(testUser);

            final var result = userService.updateUserProfile(userId.toString(), updateRequest);

            assertThat(result).isNotNull();
            verify(userRepository).findById(userId);
            verify(userRepository).existsByEmail("complete@example.com");
            verify(userRepository).existsByPhone("36701234567");
            verify(passwordEncoder).matches("currentPassword", "encodedPassword");
            verify(passwordEncoder).encode("newCompletePassword123!");
            verify(userRepository).saveAndFlush(any(User.class));
        }

        @Test
        @DisplayName("Should throw ValidationException when email already exists")
        void emailExists() {
            final var updateRequest = UserProfileDto.builder()
                .email("existing@example.com")
                .build();

            when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
            when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);

            assertThatThrownBy(() -> userService.updateUserProfile(userId.toString(), updateRequest))
                .isInstanceOf(ValidationException.class)
                .hasMessage("Email already exists");

            verify(userRepository).findById(userId);
            verify(userRepository).existsByEmail("existing@example.com");
        }

        @Test
        @DisplayName("Should throw ValidationException when phone already exists")
        void phoneExists() {
            final var updateRequest = UserProfileDto.builder()
                .phone("36301111111")
                .build();

            when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
            when(userRepository.existsByPhone("36301111111")).thenReturn(true);

            assertThatThrownBy(() -> userService.updateUserProfile(userId.toString(), updateRequest))
                .isInstanceOf(ValidationException.class)
                .hasMessage("Phone number already in use by other user");

            verify(userRepository).findById(userId);
            verify(userRepository).existsByPhone("36301111111");
        }

        @Test
        @DisplayName("Should throw ValidationException when current password is missing")
        void currentPasswordMissing() {
            final var updateRequest = UserProfileDto.builder()
                .newPassword("newPassword123!")
                .build();

            when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));

            assertThatThrownBy(() -> userService.updateUserProfile(userId.toString(), updateRequest))
                .isInstanceOf(ValidationException.class)
                .hasMessage("Current password is required");

            verify(userRepository).findById(userId);
        }

        @Test
        @DisplayName("Should throw ValidationException when new password is missing")
        void newPasswordMissing() {
            final var updateRequest = UserProfileDto.builder()
                .currentPassword("currentPassword")
                .build();

            when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));

            assertThatThrownBy(() -> userService.updateUserProfile(userId.toString(), updateRequest))
                .isInstanceOf(ValidationException.class)
                .hasMessage("New password required");

            verify(userRepository).findById(userId);
        }

        @Test
        @DisplayName("Should throw ValidationException when current password is incorrect")
        void CurrentPasswordIncorrect() {
            final var updateRequest = UserProfileDto.builder()
                .currentPassword("wrongPassword")
                .newPassword("newPassword123!")
                .build();

            when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));

            when(passwordEncoder.matches("wrongPassword", "encodedPassword")).thenReturn(false);

            assertThatThrownBy(() -> userService.updateUserProfile(userId.toString(), updateRequest))
                .isInstanceOf(ValidationException.class)
                .hasMessage("Current password is incorrect");

            verify(userRepository).findById(userId);
            verify(passwordEncoder).matches("wrongPassword", "encodedPassword");
        }
    }
}
