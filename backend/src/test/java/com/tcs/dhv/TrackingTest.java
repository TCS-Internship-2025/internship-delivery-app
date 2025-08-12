package com.tcs.dhv;

import com.tcs.dhv.domain.dto.StatusUpdateDto;
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
import com.tcs.dhv.service.ParcelService;
import com.tcs.dhv.service.ParcelStatusHistoryService;
import com.tcs.dhv.service.TrackingService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest(properties = {
        "spring.datasource.url=jdbc:postgresql://localhost:${DB_PORT:5432}/${DB_NAME:parcel_db}",
        "spring.datasource.username=${DB_USER}",
        "spring.datasource.password=${DB_PASSWORD}"
})
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@Transactional
public class TrackingTest {

    @Autowired
    private TrackingService trackingService;

    @Autowired
    private ParcelStatusHistoryService parcelStatusHistoryService;

    @Autowired
    private ParcelRepository parcelRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private RecipientRepository recipientRepository;

    private final String validTrackingCode = "HU2123499000AA";
    private final String invalidTrackingCode = "INVALIDCODE123";
    @Autowired
    private ParcelService parcelService;

    @BeforeEach
    void setUpData() {
        var parcel = createParcel();
        parcelStatusHistoryService.addStatusHistory(parcel.getId(), "parcel was created");
    }

    @Test
    void testValidTrackingCodePublicTracking() {
        var dto = trackingService.getPublicTrackingDetails(validTrackingCode);

        assertNotNull(dto, "Tracking details should not be null");
        assertEquals(validTrackingCode, dto.trackingCode());
        assertEquals("John Sender", dto.senderName());
        assertEquals("Jane Recipient", dto.recipient().name());
    }

    @Test
    void testTrackingDetailsForUserAsSender() {
        var sender = userRepository.findByEmail("sender@test.com").orElseThrow();

        var parcel = parcelRepository.findByTrackingCode(validTrackingCode);

        var dto = trackingService.getTrackingDetailsForUser(validTrackingCode, sender.getId(), sender.getEmail());

        assertNotNull(dto);
        assertEquals(validTrackingCode, dto.trackingCode());
        assertEquals("John Sender", dto.senderName());
        assertEquals("sender@test.com", dto.senderEmail());
        assertEquals(parcel.get().getCreatedAt().plusDays(7),dto.estimateDelivery().get());
    }

    @Test
    void testInvalidTrackingCodeThrowsException() {
        assertThrows(EntityNotFoundException.class, () -> {
            trackingService.getPublicTrackingDetails(invalidTrackingCode);
        });
    }

    @Test
    void testTrackingTimelineWithValidData(){
        var trackingResponse = trackingService.getPublicTrackingDetails(validTrackingCode);

        var statusUpdateDto = new StatusUpdateDto(ParcelStatus.PICKED_UP, "parcel has been picked up");

        parcelService.updateParcelStatus(validTrackingCode, statusUpdateDto);

        var timeline =  parcelStatusHistoryService.getParcelTimeline(trackingResponse.parcelId());

        assertFalse(timeline.isEmpty(), "Timeline should contain at least one status update");
        assertEquals(2, timeline.size());
        assertEquals(ParcelStatus.PICKED_UP, timeline.get(1).status());
        assertEquals(ParcelStatus.CREATED, timeline.get(0).status());

    }

    @Test
    void testInvalidStatusChangeThrowsException() {
        var statusUpdateDto = new StatusUpdateDto(ParcelStatus.DELIVERED, "delivery invalid");

        assertThrows(IllegalArgumentException.class, () -> {
            parcelService.updateParcelStatus(validTrackingCode, statusUpdateDto);
        });
    }

    private Parcel createParcel() {
        var sender = User.builder()
                .name("John Sender")
                .email("sender@test.com")
                .password("pass")
                .isVerified(true)
                .build();

        sender = userRepository.save(sender);

        var recipient = Recipient.builder()
                .name("Jane Recipient")
                .email("recipient@test.com")
                .build();

       recipient = recipientRepository.save(recipient);

        var address = Address.builder()
                .line1("Rakoczi ut 123")
                .city("Budapest")
                .country("Hungary")
                .postalCode("1000")
                .build();

        address = addressRepository.save(address);

        var parcel = Parcel.builder()
                .sender(sender)
                .trackingCode(validTrackingCode)
                .address(address)
                .recipient(recipient)
                .deliveryType(DeliveryType.HOME)
                .paymentType(PaymentType.RECIPIENT_PAYS)
                .build();

        parcel = parcelRepository.save(parcel);

        return parcel;
    }

}
