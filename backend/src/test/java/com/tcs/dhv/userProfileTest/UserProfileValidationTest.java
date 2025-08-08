package com.tcs.dhv.userProfileTest;

import com.tcs.dhv.domain.dto.UserProfileDto;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

public class UserProfileValidationTest {

    private final Validator validator;

    @BeforeEach
    void setUp() {
        final var factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Nested
    @DisplayName("Email Validation Tests")
    class EmailValidationTests {

        @Test
        @DisplayName("Should accept valid email addresses")
        void validEmailsTest(){
            final var validEmails = new String[]{
                "user@example.com",
                "test.email@domain.co.uk",
                "user+tag@example.org",
                "firstname.lastname@company.com",
                "user123@test-domain.hu",
                "a@b.co",
                "test@sub.domain.com"
            };

            for (final var email : validEmails) {
                final var Userdto = UserProfileDto.builder()
                    .email(email)
                    .build();

                Set<ConstraintViolation<UserProfileDto>> violations = validator.validate(Userdto);

                assertThat(violations.stream()
                    .anyMatch(v ->
                        v.getPropertyPath().toString().equals("email")))
                    .as("Email '%s' should be invalid", email)
                    .isTrue();
            }
        }

        @Test
        @DisplayName("Should reject email exceeding 254 characters")
        void shouldRejectOversizedEmail() {
            // Create email with 255 characters (over limit)
            String longEmail = "a".repeat(240) + "@example.com"; // 251 + 12 = 263 chars

            UserProfileDto dto = UserProfileDto.builder()
                .email(longEmail)
                .build();

            Set<ConstraintViolation<UserProfileDto>> violations = validator.validate(dto);

            assertThat(violations.stream()
                .anyMatch(v -> v.getPropertyPath().toString().equals("email") &&
                    v.getMessage().contains("cannot exceed 254 characters")))
                .isTrue();
        }

        @Test
        @DisplayName("Should accept email with exactly 254 characters")
        void shouldAcceptEmailWithExactLimit() {
            // Create email with exactly 254 characters
            String maxEmail = "a".repeat(240) + "@example.co"; // 240 + 11 = 251, need 3 more
            maxEmail = "a".repeat(243) + "@example.co"; // 243 + 11 = 254 chars

            UserProfileDto dto = UserProfileDto.builder()
                .email(maxEmail)
                .build();

            Set<ConstraintViolation<UserProfileDto>> violations = validator.validate(dto);

            assertThat(violations.stream()
                .filter(v -> v.getPropertyPath().toString().equals("email"))
                .count()).isEqualTo(0);
        }
    }

    @Nested
    @DisplayName("Phone Validation Tests")
    class PhoneValidationTests {

        @Test
        @DisplayName("Should accept valid Hungarian phone numbers")
        void correctNumbersTest(){
            final var validPhoneNumbers = new String[]{
                "+36201234567",
                "+36301234567",
                "+36311234567",
                "+36501234567",
                "+36701234567",
                "0036187654321",
                "06221234567",
                "06297654321"
            };

            for( var phone : validPhoneNumbers) {
                final var dto = UserProfileDto.builder()
                    .phone(phone)
                    .build();

                Set<ConstraintViolation<UserProfileDto>> violations = validator.validate(dto);

                assertThat(violations.stream()
                    .filter(v -> v.getPropertyPath().toString().equals("phone"))
                    .count())
                    .as("Phone '%s' should be invalid", phone)
                    .isEqualTo(0);
            }
        }

        @Test
        @DisplayName(" Should reject invalid phone numbers")
        void invalidPhonesTest(){
            final var validPhoneNumbers = new String[]{
                "1234567890",       // No country code
                "+36123456789",     // Too short
                "+3620123456789",   // Too long

                "36201234567",      // Missing + or 00
                "+3620 123 4567",   // Spaces not allowed
                "+3620-123-4567",   // Dashes not allowed
                "+3620.123.4567",   // Dots not allowed
                "",                 // Empty
                "abc",              // Non-numeric
                "+36123456",        // Too short overall
                "+361123456",       // Landline too short
                "+36112345678901",  // Landline too long
                "+370123456789",    // Wrong country code
                "+36671234567",     // Invalid prefixes
                "+36651234567",
                "+36641234567",
                "+36611234567",
                "+36601234567",
                "+36581234567",
                "+36511234567",
                "+36431234567",
                "+36411234567",
                "+36401234567",
                "+36391234567",
                "+36971234567",
                "+36981234567",
                "+36861234567",
                "+36811234567"
            }

            for( var phone : validPhoneNumbers) {
                final var dto = UserProfileDto.builder()
                    .phone(phone)
                    .build();

                Set<ConstraintViolation<UserProfileDto>> violations = validator.validate(dto);

                assertThat(violations.stream()
                    .anyMatch(v -> v.getPropertyPath().toString().equals("phone")))
                    .as("Phone '%s should be invalid", phone)
                    .isTrue();
            }
        }
    }

    @Nested
    @DisplayName("Password Validation Tests")
    class PasswordValidationTests {

        @Test
        @DisplayName("Should accept valid passwords")
        void correctPasswordsTest(){
            final var validPasswords = new String[]{
                "TestPass123!",
                "MySecure@Pwd1",
                "Str0ng&Pwd",
                "Minimum8$",
                "a".repeat(120) + "A1!"
            }

            for( var password : validPasswords) {
                final var dto = UserProfileDto.builder()
                    .newPassword(password)
                    .build();

                Set<ConstraintViolation<UserProfileDto>> violations = validator.validate(dto);

                assertThat(violations.stream()
                    .filter(v -> v.getPropertyPath().toString().equals("newPassword"))
                    .count())
                    .as("Password '%s' should be valid", password)
                    .isEqualTo(0);
            }
        }

        @Test
        @DisplayName("Should reject passwords missing required character types")
        void invalidPasswordstest() {
            String[] invalidPasswords = {
                "alllowercase123!",     // Missing uppercase
                "ALLUPPERCASE123!",     // Missing lowercase
                "NoDigitsHere!",        // Missing digits
                "NoSpecialChars123",    // Missing special characters
                "ValidPass123",         // Missing special characters
                "validpass123!",        // Missing uppercase
                "VALIDPASS123!",        // Missing lowercase
                "ValidPass!"            // Missing digits
            };

            for (String password : invalidPasswords) {
                UserProfileDto dto = UserProfileDto.builder()
                    .newPassword(password)
                    .build();

                Set<ConstraintViolation<UserProfileDto>> violations = validator.validate(dto);

                assertThat(violations.stream()
                    .anyMatch(v -> v.getPropertyPath().toString().equals("newPassword")))
                    .as("Password '%s' should be invalid", password)
                    .isTrue();
            }
        }

        @Test
        @DisplayName("Should accept all allowed special characters")
        void checkAllSpecCharactersTest() {
            String specialChars = "@#$%^&+=!?.,;:~`<>{}[]()_-";

            for (char specialChar : specialChars.toCharArray()) {
                String password = "ValidPass123" + specialChar;

                UserProfileDto dto = UserProfileDto.builder()
                    .newPassword(password)
                    .build();

                Set<ConstraintViolation<UserProfileDto>> violations = validator.validate(dto);

                assertThat(violations.stream()
                    .filter(v -> v.getPropertyPath().toString().equals("newPassword"))
                    .count())
                    .as("Password with special char '%c' should be valid", specialChar)
                    .isEqualTo(0);
            }
        }
    }


}
