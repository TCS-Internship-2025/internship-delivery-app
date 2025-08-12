package com.tcs.dhv.userProfileTest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tcs.dhv.domain.dto.AddressDto;
import com.tcs.dhv.domain.dto.LoginRequest;
import com.tcs.dhv.domain.dto.RegisterRequest;
import com.tcs.dhv.domain.dto.UserProfileDto;
import com.tcs.dhv.domain.entity.User;
import com.tcs.dhv.repository.UserRepository;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.*;
import org.springframework.test.annotation.Commit;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
//@Transactional
public class UserProfileRealEndToEndTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @LocalServerPort
    private int port;

    private String baseUrl;
    private static String accessToken;
    private static String userEmail = "realtest@example.com";

    @BeforeEach
    void setUp() {
        baseUrl = "http://localhost:" + port;
    }

    @Test
    @Order(1)
    @Commit
    @DisplayName("1. Register and verify user")
    void registerAndVerifyUser() throws Exception {
        // 1. Register user
        RegisterRequest registerRequest = RegisterRequest.builder()
            .name("Real Test User")
            .email(userEmail)
            .password("RealTestPass123!")
            .build();

        ResponseEntity<String> registerResponse = restTemplate.postForEntity(
            baseUrl + "/api/auth/register",
            registerRequest,
            String.class
        );

        assertThat(registerResponse.getStatusCode()).isEqualTo(HttpStatus.CREATED);

        // 2. Manually verify user (simulate email verification)
        User user = userRepository.findByEmail(userEmail).orElseThrow();
        user.setIsVerified(true);
        System.out.println(user.getIsVerified());
        userRepository.save(user);
        System.out.println(user.getIsVerified());
        assertThat(user.getIsVerified()).isTrue();
        System.out.println("✅ User registered and verified: " + userEmail);
    }

    @Test
    @Order(2)
    @DisplayName("2. Login and get access token")
    void loginUser() throws Exception {
        LoginRequest loginRequest = new LoginRequest(userEmail, "RealTestPass123!");

        ResponseEntity<String> loginResponse = restTemplate.postForEntity(
            baseUrl + "/api/auth/login",
            loginRequest,
            String.class
        );

        assertThat(loginResponse.getStatusCode()).isEqualTo(HttpStatus.OK);

        // Extract token from response
        String responseBody = loginResponse.getBody();
        var jsonNode = objectMapper.readTree(responseBody);
        accessToken = jsonNode.get("token").asText();

        assertThat(accessToken).isNotBlank();
        System.out.println("✅ User logged in successfully, token obtained");
    }

    @Test
    @Order(3)
    @DisplayName("3. Get user profile")
    void getUserProfile() throws Exception {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<String> profileResponse = restTemplate.exchange(
            baseUrl + "/api/users/me",
            HttpMethod.GET,
            entity,
            String.class
        );

        assertThat(profileResponse.getStatusCode()).isEqualTo(HttpStatus.OK);

        // Parse and verify profile data
        String responseBody = profileResponse.getBody();
        var profileJson = objectMapper.readTree(responseBody);

        assertThat(profileJson.get("name").asText()).isEqualTo("Real Test User");
        assertThat(profileJson.get("email").asText()).isEqualTo(userEmail);
        assertThat(profileJson.get("isVerified").asBoolean()).isTrue();

        System.out.println("✅ Profile retrieved successfully:");
        System.out.println("   Name: " + profileJson.get("name").asText());
        System.out.println("   Email: " + profileJson.get("email").asText());
        System.out.println("   Verified: " + profileJson.get("isVerified").asBoolean());
    }

    @Test
    @Order(6)
    @DisplayName("4. Update basic profile information")
    void updateBasicProfile() throws Exception {
        UserProfileDto updateRequest = UserProfileDto.builder()
            .name("Updated Real Test User")
            .email("updated.realtest@example.com")
            .phone("+36201234567")
            .build();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<UserProfileDto> entity = new HttpEntity<>(updateRequest, headers);

        ResponseEntity<String> updateResponse = restTemplate.exchange(
            baseUrl + "/api/users/me",
            HttpMethod.PUT,
            entity,
            String.class
        );

        assertThat(updateResponse.getStatusCode()).isEqualTo(HttpStatus.OK);

        // Verify the update
        String responseBody = updateResponse.getBody();
        var updatedProfile = objectMapper.readTree(responseBody);

        assertThat(updatedProfile.get("name").asText()).isEqualTo("Updated Real Test User");
        assertThat(updatedProfile.get("email").asText()).isEqualTo("updated.realtest@example.com");
        assertThat(updatedProfile.get("phone").asText()).isEqualTo("+36201234567");

        userEmail = "updated.realtest@example.com";

        System.out.println("✅ Basic profile updated successfully:");
        System.out.println("   New Name: " + updatedProfile.get("name").asText());
        System.out.println("   New Email: " + updatedProfile.get("email").asText());
        System.out.println("   New Phone: " + updatedProfile.get("phone").asText());
    }

    @Test
    @Order(7)
    @DisplayName("5. Update user address")
    void updateUserAddress() throws Exception {
        AddressDto address = new AddressDto(
            "Fő utca 123",
            "2. emelet 5. ajtó",
            "A épület",
            "25",
            "Budapest",
            "1053",
            "Hungary",
            47.4979,
            19.0402
        );

        UserProfileDto updateRequest = UserProfileDto.builder()
            .address(address)
            .build();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<UserProfileDto> entity = new HttpEntity<>(updateRequest, headers);

        ResponseEntity<String> updateResponse = restTemplate.exchange(
            baseUrl + "/api/users/me",
            HttpMethod.PUT,
            entity,
            String.class
        );

        assertThat(updateResponse.getStatusCode()).isEqualTo(HttpStatus.OK);

        // Verify address was updated
        String responseBody = updateResponse.getBody();
        var updatedProfile = objectMapper.readTree(responseBody);
        var addressNode = updatedProfile.get("address");

        assertThat(addressNode.get("line1").asText()).isEqualTo("Fő utca 123");
        assertThat(addressNode.get("line2").asText()).isEqualTo("2. emelet 5. ajtó");
        assertThat(addressNode.get("city").asText()).isEqualTo("Budapest");
        assertThat(addressNode.get("postalCode").asText()).isEqualTo("1053");

        System.out.println("✅ Address updated successfully:");
        System.out.println("   Address: " + addressNode.get("line1").asText());
        System.out.println("   City: " + addressNode.get("city").asText());
    }

    @Test
    @Order(4)
    @Commit
    @DisplayName("4. Update password")
    void updatePassword() throws Exception {
        User userBefore = userRepository.findByEmail(userEmail).orElseThrow();
        String oldHash = userBefore.getPassword();
        System.out.println("Password hash BEFORE update: " + oldHash.substring(0, 20) + "...");

        // Create JSON string directly instead of using DTO
        String jsonPayload = """
        {
            "currentPassword": "RealTestPass123!",
            "newPassword": "NewRealTestPass456!"
        }
        """;

        System.out.println("Sending JSON payload: " + jsonPayload);

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Send raw JSON string instead of DTO object
        HttpEntity<String> entity = new HttpEntity<>(jsonPayload, headers);

        ResponseEntity<String> updateResponse = restTemplate.exchange(
            baseUrl + "/api/users/me",
            HttpMethod.PUT,
            entity,
            String.class
        );

        assertThat(updateResponse.getStatusCode()).isEqualTo(HttpStatus.OK);

        // Force database synchronization
        userRepository.flush();
        Thread.sleep(1000);

        User userAfter = userRepository.findByEmail(userEmail).orElseThrow();
        String newHash = userAfter.getPassword();
        System.out.println("Password hash AFTER update: " + newHash.substring(0, 20) + "...");

        assertThat(newHash).isNotEqualTo(oldHash);
        System.out.println("✅ Password hash successfully changed in database");
    }


    @Test
    @Order(5)
    @DisplayName("5. Verify login with new password")
    void verifyLoginWithNewPassword() throws Exception {
        // Verify password change by logging in with new password
        LoginRequest newLoginRequest = new LoginRequest(userEmail, "NewRealTestPass456!");

        ResponseEntity<String> loginResponse = restTemplate.postForEntity(
            baseUrl + "/api/auth/login",
            newLoginRequest,
            String.class
        );

        if (loginResponse.getStatusCode() != HttpStatus.OK) {
            System.err.println("Login failed - Status: " + loginResponse.getStatusCode());
            System.err.println("Response: " + loginResponse.getBody());

            // Additional debug info
            User debugUser = userRepository.findByEmail(userEmail).orElse(null);
            if (debugUser != null) {
                System.err.println("User email: " + debugUser.getEmail());
                System.err.println("User verified: " + debugUser.getIsVerified());
            }
        }

        assertThat(loginResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        System.out.println("✅ Login with new password successful");
    }
    /*
    @Test
    @Order(7)
    @DisplayName("7. Update all fields at once")
    void updateAllFieldsAtOnce() throws Exception {
        AddressDto newAddress = new AddressDto(
            "Váci út 45",
            "4. emelet",
            "B épület",
            "10",
            "Budapest",
            "1134",
            "Hungary",
            47.5207,
            19.0574
        );

        UserProfileDto updateRequest = UserProfileDto.builder()
            .name("Complete Update User")
            .email("complete.realtest@example.com")
            .phone("+36301234567")
            .address(newAddress)
            .currentPassword("NewRealTestPass456@")
            .newPassword("FinalRealTestPass789#")
            .build();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<UserProfileDto> entity = new HttpEntity<>(updateRequest, headers);

        ResponseEntity<String> updateResponse = restTemplate.exchange(
            baseUrl + "/api/users/me",
            HttpMethod.PUT,
            entity,
            String.class
        );

        assertThat(updateResponse.getStatusCode()).isEqualTo(HttpStatus.OK);

        // Verify all updates
        String responseBody = updateResponse.getBody();
        var updatedProfile = objectMapper.readTree(responseBody);

        assertThat(updatedProfile.get("name").asText()).isEqualTo("Complete Update User");
        assertThat(updatedProfile.get("email").asText()).isEqualTo("complete.realtest@example.com");
        assertThat(updatedProfile.get("phone").asText()).isEqualTo("+36301234567");
        assertThat(updatedProfile.get("address").get("line1").asText()).isEqualTo("Váci út 45");

        System.out.println("✅ Complete profile update successful:");
        System.out.println("   Name: " + updatedProfile.get("name").asText());
        System.out.println("   Email: " + updatedProfile.get("email").asText());
        System.out.println("   Phone: " + updatedProfile.get("phone").asText());
        System.out.println("   Address: " + updatedProfile.get("address").get("line1").asText());
    }

    @Test
    @Order(8)
    @DisplayName("8. Final profile verification")
    void finalProfileVerification() throws Exception {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<String> profileResponse = restTemplate.exchange(
            baseUrl + "/api/users/me",
            HttpMethod.GET,
            entity,
            String.class
        );

        assertThat(profileResponse.getStatusCode()).isEqualTo(HttpStatus.OK);

        String responseBody = profileResponse.getBody();
        var finalProfile = objectMapper.readTree(responseBody);

        // Verify all final values
        assertThat(finalProfile.get("name").asText()).isEqualTo("Complete Update User");
        assertThat(finalProfile.get("email").asText()).isEqualTo("complete.realtest@example.com");
        assertThat(finalProfile.get("phone").asText()).isEqualTo("+36301234567");

        System.out.println("✅ Final profile verification successful");
        System.out.println("🎉 All user profile functionality tests completed successfully!");
    }*/
}
