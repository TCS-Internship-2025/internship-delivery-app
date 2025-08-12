package com.tcs.dhv.userProfileTest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tcs.dhv.domain.dto.AddressDto;
import com.tcs.dhv.domain.dto.LoginRequest;
import com.tcs.dhv.domain.dto.RegisterRequest;
import com.tcs.dhv.domain.dto.UserProfileDto;
import com.tcs.dhv.domain.entity.Address;
import com.tcs.dhv.domain.entity.Parcel;
import com.tcs.dhv.domain.entity.Recipient;
import com.tcs.dhv.domain.entity.User;
import com.tcs.dhv.domain.enums.DeliveryType;
import com.tcs.dhv.domain.enums.ParcelStatus;
import com.tcs.dhv.domain.enums.PaymentType;
import com.tcs.dhv.repository.AddressRepository;
import com.tcs.dhv.repository.ParcelRepository;
import com.tcs.dhv.repository.RecipientRepository;
import com.tcs.dhv.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.*;
import org.springframework.test.annotation.Commit;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

@Slf4j
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class UserProfileEndToEndTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ParcelRepository parcelRepository;

    @Autowired
    private RecipientRepository recipientRepository;

    @Autowired
    private AddressRepository addressRepository;

    @LocalServerPort
    private int port;

    private String baseUrl;
    private static String accessToken;
    private static String userEmail = "realtest@example.com";

    @BeforeEach
    void setUp() {
        baseUrl = "http://localhost:" + port;
    }

    @AfterAll
    static void cleanUpAfterAllTests(@Autowired ParcelRepository parcelRepository,
                                     @Autowired RecipientRepository recipientRepository,
                                     @Autowired AddressRepository addressRepository,
                                     @Autowired UserRepository userRepository) {
        try {
            parcelRepository.deleteAll();
            recipientRepository.deleteAll();
            addressRepository.deleteAll();
            userRepository.deleteAll();

        } catch (Exception e) {
            log.info("Cleanup failed: {}", e.getMessage());
        }
    }

    @Test
    @Order(1)
    @Commit
    @DisplayName("1. Register and verify user")
    void registerAndVerifyUser() {
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

        User user = userRepository.findByEmail(userEmail).orElseThrow();
        user.setIsVerified(true);
        userRepository.save(user);
        assertThat(user.getIsVerified()).isTrue();
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

        String responseBody = loginResponse.getBody();
        var jsonNode = objectMapper.readTree(responseBody);
        accessToken = jsonNode.get("token").asText();

        assertThat(accessToken).isNotBlank();
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

        String responseBody = profileResponse.getBody();
        var profileJson = objectMapper.readTree(responseBody);

        assertThat(profileJson.get("name").asText()).isEqualTo("Real Test User");
        assertThat(profileJson.get("email").asText()).isEqualTo(userEmail);
        assertThat(profileJson.get("isVerified").asBoolean()).isTrue();
    }

    @Test
    @Order(4)
    @Commit
    @DisplayName("4. Update password")
    void updatePassword() throws Exception {
        String jsonPayload = """
        {
            "currentPassword": "RealTestPass123!",
            "newPassword": "NewRealTestPass456!"
        }
        """;

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> entity = new HttpEntity<>(jsonPayload, headers);

        ResponseEntity<String> updateResponse = restTemplate.exchange(
            baseUrl + "/api/users/me",
            HttpMethod.PUT,
            entity,
            String.class
        );

        assertThat(updateResponse.getStatusCode()).isEqualTo(HttpStatus.OK);

        userRepository.flush();
        Thread.sleep(1000);
    }


    @Test
    @Order(5)
    @DisplayName("5. Verify login with new password")
    void verifyLoginWithNewPassword() {
        LoginRequest newLoginRequest = new LoginRequest(userEmail, "NewRealTestPass456!");

        ResponseEntity<String> loginResponse = restTemplate.postForEntity(
            baseUrl + "/api/auth/login",
            newLoginRequest,
            String.class
        );

        assertThat(loginResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    @Order(6)
    @DisplayName("6. Update basic profile information")
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

        String responseBody = updateResponse.getBody();
        var updatedProfile = objectMapper.readTree(responseBody);

        assertThat(updatedProfile.get("name").asText()).isEqualTo("Updated Real Test User");
        assertThat(updatedProfile.get("email").asText()).isEqualTo("updated.realtest@example.com");
        assertThat(updatedProfile.get("phone").asText()).isEqualTo("+36201234567");

        userEmail = "updated.realtest@example.com";
    }

    @Test
    @Order(7)
    @DisplayName("7. Update user address")
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

        String responseBody = updateResponse.getBody();
        var updatedProfile = objectMapper.readTree(responseBody);
        var addressNode = updatedProfile.get("address");

        assertThat(addressNode.get("line1").asText()).isEqualTo("Fő utca 123");
        assertThat(addressNode.get("line2").asText()).isEqualTo("2. emelet 5. ajtó");
        assertThat(addressNode.get("city").asText()).isEqualTo("Budapest");
        assertThat(addressNode.get("postalCode").asText()).isEqualTo("1053");
    }



    @Test
    @Order(8)
    @DisplayName("8. Update all fields at once")
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

        userEmail = "complete.realtest@example.com";

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

        String responseBody = updateResponse.getBody();
        var updatedProfile = objectMapper.readTree(responseBody);

        assertThat(updatedProfile.get("name").asText()).isEqualTo("Complete Update User");
        assertThat(updatedProfile.get("email").asText()).isEqualTo("complete.realtest@example.com");
        assertThat(updatedProfile.get("phone").asText()).isEqualTo("+36301234567");
        assertThat(updatedProfile.get("address").get("line1").asText()).isEqualTo("Váci út 45");
    }

    @Test
    @Order(9)
    @DisplayName("9. Final profile verification")
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

        assertThat(finalProfile.get("name").asText()).isEqualTo("Complete Update User");
        assertThat(finalProfile.get("email").asText()).isEqualTo("complete.realtest@example.com");
        assertThat(finalProfile.get("phone").asText()).isEqualTo("+36301234567");
    }

    @Test
    @Order(10)
    @DisplayName("10. Fail to delete user when user has active parcels")
    void failToDeleteUserWhenUserHasActiveParcels() {
        User user = userRepository.findByEmail(userEmail).orElseThrow();
        Address address = Address.builder()
            .line1("Test Street 123")
            .city("Budapest")
            .postalCode("1111")
            .country("Hungary")
            .build();

        Address savedAddress = addressRepository.saveAndFlush(address);

        Recipient recipient = Recipient.builder()
            .name("Test Recipient")
            .email("recipient@example.com")
            .phone("+36301111111")
            .address(savedAddress)
            .build();

        Recipient savedRecipient = recipientRepository.save(recipient);

        Parcel parcel = Parcel.builder()
            .sender(user)
            .trackingCode("HU1234567890AB")
            .currentStatus(ParcelStatus.CREATED)
            .recipient(savedRecipient)
            .paymentType(PaymentType.SENDER_PAYS)
            .deliveryType(DeliveryType.HOME)
            .build();

        parcelRepository.saveAndFlush(parcel);

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        HttpEntity<Void> deleteEntity = new HttpEntity<>(headers);

        ResponseEntity<String> deleteResponse = restTemplate.exchange(
            baseUrl + "/api/users/me",
            HttpMethod.DELETE,
            deleteEntity,
            String.class
        );

        assertThat(deleteResponse.getStatusCode().value()).isBetween(400, 499);

        boolean userStillExists = userRepository.findByEmail(userEmail).isPresent();
        assertThat(userStillExists).isTrue();
    }

    @Test
    @Order(11)
    @DisplayName("11. Clean up test data before user deletion")
    void cleanupTestDataBeforeDeletion() {
        User user = userRepository.findByEmail(userEmail).orElseThrow();

        List<Parcel> userParcels = parcelRepository.findAllBySenderId(user.getId());

        Set<Recipient> recipientsToDelete = new HashSet<>();
        Set<Address> addressesToDelete = new HashSet<>();

        for (Parcel parcel : userParcels) {
            if (parcel.getRecipient() != null) {
                recipientsToDelete.add(parcel.getRecipient());
                if (parcel.getRecipient().getAddress() != null) {
                    addressesToDelete.add(parcel.getRecipient().getAddress());
                }
            }
        }

        parcelRepository.deleteAll(userParcels);
        parcelRepository.flush();

        recipientRepository.deleteAll(recipientsToDelete);
        recipientRepository.flush();

        addressRepository.deleteAll(addressesToDelete);
        addressRepository.flush();

        parcelRepository.flush();
        recipientRepository.flush();
        addressRepository.flush();
    }



    @Test
    @Order(12)
    @DisplayName("12. Successfully delete user profile when no active parcels exist")
    void successfullyDeleteUserProfileWithoutParcels() {
        User user = userRepository.findByEmail(userEmail).orElseThrow();

        List<Parcel> userParcels = parcelRepository.findAllBySenderId(user.getId());
        for (Parcel parcel : userParcels) {
            parcel.setCurrentStatus(ParcelStatus.DELIVERED);
            parcelRepository.save(parcel);
        }
        parcelRepository.flush();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        HttpEntity<Void> deleteEntity = new HttpEntity<>(headers);

        ResponseEntity<String> deleteResponse = restTemplate.exchange(
            baseUrl + "/api/users/me",
            HttpMethod.DELETE,
            deleteEntity,
            String.class
        );

        assertThat(deleteResponse.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);

        boolean userExists = userRepository.findByEmail(userEmail).isPresent();
        assertThat(userExists).isFalse();
    }
}
