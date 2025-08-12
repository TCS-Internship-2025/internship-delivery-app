package com.tcs.dhv.userProfileTest;

import com.tcs.dhv.domain.dto.UserProfileDto;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
public class UserProfileValidationTest {

    @Autowired
    private Validator validator;

    @Nested
    @DisplayName("Email Validation Tests")
    class EmailValidationTests {

        @Test
        @DisplayName("Should accept valid email addresses")
        void validEmailsTest() {
            final var validEmails = new String[]{
                "user@example.com",
                "test.email@domain.co.uk",
                "test.email@domain.hu",
                "user+tag@example.org",
                "firstname.lastname@company.com",
                "user123@test-domain.hu",
                "a@b.co",
                "test@sub.domain.com"
            };

            for (final var email : validEmails) {
                final var userDto = UserProfileDto.builder()
                    .email(email)
                    .build();

                Set<ConstraintViolation<UserProfileDto>> violations = validator.validate(userDto);

                assertThat(violations.stream()
                    .anyMatch(v -> v.getPropertyPath().toString().equals("email")))
                    .as("Email '%s' should be valid", email)
                    .isFalse();
            }
        }

        @Test
        @DisplayName("Should reject emails with invalid characters")
        void invalidEmailsTest() {
            final var invalidEmails = new String[]{
                "user@exam ple.com",
                "us er@example.com",
                "user@example..com",
                "user..name@example.com",
                ".user@example.com",
                "user.@example.com",
                "user@.example.com",
                "user@example.com.",
                "user@",
                "@example.com",
                "user@@example.com",
                "user@exam@ple.com",
                "user@example.",
                "user@.com",
                "user name@example.com",
                "user@exam ple.com",
                "user@example..com",
                "user@-example.com",
                "user@example-.com",
                "user[brackets]@example.com",
                "user<angle>@example.com",
                "user,comma@example.com",
                "user;semicolon@example.com",
                "user:colon@example.com",

            };

            for (final var email : invalidEmails) {
                final var userDto = UserProfileDto.builder()
                    .email(email)
                    .build();

                Set<ConstraintViolation<UserProfileDto>> violations = validator.validate(userDto);

                assertThat(violations.stream()
                    .anyMatch(v -> v.getPropertyPath().toString().equals("email")))
                    .as("Email '%s' should be invalid", email)
                    .isTrue();
            }
        }


    }

    @Nested
    @DisplayName("Phone Validation Tests")
    class PhoneValidationTests {

        @Test
        @DisplayName("Should accept valid Hungarian phone numbers")
        void correctNumbersTest() {
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
                    .as("Phone '%s' should be valid", phone)
                    .isEqualTo(0);
            }
        }

        @Test
        @DisplayName("Should reject invalid phone numbers")
        void invalidPhonesTest() {
            final var invalidPhoneNumbers = new String[]{
                "1234567890",
                "00363012345678",
                "062212345678",
                "+3612345678",
                "+3620123456789",
                "36201234567",
                "+3620 123 4567",
                "+3620-123-4567",
                "+3620.123.4567",
                "",
                "abc",
                "+36123456",
                "+361123456",
                "+36112345678901",
                "+370123456789",
                "+36671234567",
            };

            for( var phone : invalidPhoneNumbers) {
                final var dto = UserProfileDto.builder()
                    .phone(phone)
                    .build();

                Set<ConstraintViolation<UserProfileDto>> violations = validator.validate(dto);

                assertThat(violations.stream()
                    .anyMatch(v -> v.getPropertyPath().toString().equals("phone")))
                    .as("Phone '%s' should be invalid", phone)
                    .isTrue();
            }
        }
    }

    @Nested
    @DisplayName("Password Validation Tests")
    class PasswordValidationTests {

        @Test
        @DisplayName("Should accept valid passwords")
        void correctPasswordsTest() {
            final var validPasswords = new String[]{
                "TestPass123!",
                "MySecure@Pwd1",
                "Str0ng&Pwd",
                "Minimum8$",
                "a".repeat(120) + "A1!"
            };

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
        void invalidPasswordsTest() {
            String[] invalidPasswords = {
                "alllowercase123!",
                "ALLUPPERCASE123!",
                "NoDigitsHere!",
                "NoSpecialChars123",
                "ValidPass123",
                "validpass123!",
                "INVALIDPASS123!",
                "INValidPass!"
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
