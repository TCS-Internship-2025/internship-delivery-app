package com.tcs.dhv;

import com.icegreen.greenmail.store.FolderException;
import com.icegreen.greenmail.util.GreenMail;
import com.icegreen.greenmail.util.GreenMailUtil;
import com.icegreen.greenmail.util.ServerSetup;
import com.tcs.dhv.config.TestAsyncConfig;
import com.tcs.dhv.config.TestMailConfig;
import com.tcs.dhv.domain.entity.Address;
import com.tcs.dhv.domain.entity.User;
import com.tcs.dhv.domain.enums.ParcelStatus;
import com.tcs.dhv.service.EmailService;
import com.tcs.dhv.util.EmailConstants;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@Import({TestMailConfig.class, TestAsyncConfig.class})
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class EmailDeliveryTest {

    private static GreenMail greenMail;
    @Autowired
    private EmailService emailService;

    @BeforeAll
    void startGreenMail() {
        greenMail = new GreenMail(new ServerSetup(EmailConstants.TEST_MAIL_PORT, null, EmailConstants.EMAIL_PROTOCOL));
        greenMail.start();
    }

    @AfterEach
    void purge() {
        try {
            greenMail.purgeEmailFromAllMailboxes();
        } catch (FolderException e) {
            throw new RuntimeException(e);
        }
    }

    @AfterAll
    void stopGreenMail() {
        if(greenMail != null)
            greenMail.stop();
    }

    @Test
    void testShipmentEmailIsSent() throws Exception {
        emailService.sendShipmentCreationEmail("test@gmail.com","test2@gmail.com", "testName", "HU10digitsand2letters");

        final var messages = greenMail.getReceivedMessages();
       assertEquals(2, messages.length, "Two emails received");


        final var received = messages[0];
        assertEquals(EmailConstants.SHIPMENT_MAIL_SUBJECT, received.getSubject());
        final var body = GreenMailUtil.getBody(received).trim();
        assertTrue(body.contains("Dear testName"));
    }

    @Test
    void testDeliveryCompletionEmailIsSent() throws Exception {
        emailService.sendDeliveryCompleteEmail("test@gmail.com", "testName", "HU10digitsand2letters");

        final var messages = greenMail.getReceivedMessages();
        assertEquals(1, messages.length, "One email received");

        final var received = messages[0];
        assertEquals(EmailConstants.DELIVERY_COMPLETE_SUBJECT, received.getSubject());
        final var body = GreenMailUtil.getBody(received).trim();
        assertTrue(body.contains("Dear testName"));
    }

    @Test
    void testAddressChangeNotificationEmailIsSent() throws Exception {
        final var oldAddress = new Address(
            UUID.fromString("e58ed763-928c-4155-bee9-fdbaaadc15f3"),
            "Oldline1",
            "Oldline2",
            "building",
            "apartment",
            "city",
            "country",
            "postalCode",
            2.0,
            3.0,
            0L
        );
        final var newAddress = new Address(
            UUID.fromString("e58ed763-928c-4155-bee9-fdbaaadc15f3"),
            "Oldline1",
            "Oldline2",
            "building",
            "apartment",
            "city",
            "country",
            "postalCode",
            2.0,
            3.0,
            0L
        );
        emailService.sendAddressChangeNotification("test@gmail.com", "testName", "HU10digitsand2letters", oldAddress, newAddress, "Testing");
        final var messages = greenMail.getReceivedMessages();
        assertEquals(1, messages.length, "One email received");

        final var received = messages[0];
        assertEquals(EmailConstants.ADDRESS_CHANGE_MAIL_SUBJECT + "HU10digitsand2letters", received.getSubject());
        final var body = GreenMailUtil.getBody(received).trim();
        assertTrue(body.contains("Dear testName"));
    }

    @Test
    void testVerificationEmailIsSent() throws Exception {
        emailService.sendVerificationTokenByEmail(UUID.fromString("e58ed763-928c-4155-bee9-fdbaaadc15f3"), "testName", "test@gmail.com");
        final var messages = greenMail.getReceivedMessages();
        assertEquals(1, messages.length, "One email received");

        final var received = messages[0];
        assertEquals(EmailConstants.VERIFICATION_MAIL_SUBJECT, received.getSubject());
        final var body = GreenMailUtil.getBody(received).trim();
        assertTrue(body.contains("Dear testName"));
    }

    @Test
    void testPasswordResetEmailSent() throws Exception {
        emailService.sendPasswordResetEmail("test@gmail.com", "testName", "www.reset.org");
        final var messages = greenMail.getReceivedMessages();
        assertEquals(1, messages.length, "One email received");

        final var received = messages[0];
        assertEquals(EmailConstants.PASSWORD_CHANGE_MAIL_SUBJECT, received.getSubject());
        final var body = GreenMailUtil.getBody(received).trim();
        assertTrue(body.contains("Dear testName"));
    }

    @Test
    void testParcelStatusNotificationIsSent() throws Exception {
        emailService.sendParcelStatusChangeNotification("test@gmail.com","test2@gmail.com", "testName", ParcelStatus.CREATED, "HU10digitsand2letters");
        final var messages = greenMail.getReceivedMessages();
        assertEquals(2, messages.length, "Two email received");

        final var received = messages[0];
        assertEquals(EmailConstants.STATUS_UPDATE_MAIl_SUBJECT + "HU10digitsand2letters", received.getSubject());
        final var body = GreenMailUtil.getBody(received).trim();
        assertTrue(body.contains("Dear testName"));
    }

    @Test
    void testUserUpdatedNotificationIsSent() throws Exception {
        final var oldAddress = new Address(
                UUID.fromString("e58ed763-928c-4155-bee9-fdbaaadc15f3"),
                "Oldline1",
                "Oldline2",
                "building",
                "apartment",
                "city",
                "country",
                "postalCode",
                2.0,
                3.0,
                0L
        );
        final var newAddress = new Address(
                UUID.fromString("e58ed763-928c-4155-bee9-fdbaaadc15f3"),
                "Oldline1",
                "Oldline2",
                "building",
                "apartment",
                "city",
                "country",
                "postalCode",
                2.0,
                3.0,
                0L
        );
        final var oldUser = new User();
        oldUser.setEmail("a");
        oldUser.setName("testUser");
        oldUser.setPhone("06201234567");
        oldUser.setAddress(oldAddress);
        final var newUser = new User();
        newUser.setEmail("a");
        newUser.setName("userTest");
        newUser.setPhone("06201234567");
        newUser.setAddress(newAddress);
        emailService.sendUserUpdatedNotification("test@gmail.com", oldUser, newUser,false);
        final var messages = greenMail.getReceivedMessages();
        assertEquals(1, messages.length, "One email received");

        final var received = messages[0];
        assertEquals(EmailConstants.USER_UPDATE_MAIL_SUBJECT , received.getSubject());
        final var body = GreenMailUtil.getBody(received).trim();
        assertTrue(body.contains("Dear userTest"));
    }


}
