package com.tcs.dhv.service;

import com.tcs.dhv.domain.entity.Address;
import com.tcs.dhv.domain.entity.User;
import com.tcs.dhv.exception.MailMessagingException;
import com.tcs.dhv.repository.UserRepository;
import com.tcs.dhv.util.EmailConstants;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final OtpService otpService;
    private final UserRepository userRepository;
    private final TemplateEngine templateEngine;

    @Value("${app.base-url}")
    private String appBaseUrl;

    @Value("${dhv.client-url}")
    private String clientUrl;


    public void sendShipmentCreationEmail(
        final String email,
        final String trackingNumber
    ) {
        final var context = new Context();
        context.setVariable("trackingCode", trackingNumber);
        context.setVariable("trackingUrl", clientUrl + EmailConstants.TRACKING_PAGE_URL_ROUTE + trackingNumber);

        final var htmlContent = this.templateEngine.process("ShipmentCreationEmail.html", context);
        final var message = CreateMessage(
                EmailConstants.SHIPMENT_MAIL_SUBJECT, EmailConstants.EMAIL_SENDER, email, htmlContent);
        mailSender.send(message);

    }

    public void sendDeliveryCompleteEmail(
            String email,
            String trackingNumber
    ) {
        final var context = new Context();
        context.setVariable("trackingCode", trackingNumber);
        context.setVariable("trackingUrl", clientUrl + EmailConstants.TRACKING_PAGE_URL_ROUTE + trackingNumber);

        final var htmlContent = this.templateEngine.process("DeliveryCompletionEmail.html",context);
        final var message = CreateMessage(
                EmailConstants.DELIVERY_COMPLETE_SUBJECT, EmailConstants.EMAIL_SENDER, email, htmlContent);
        mailSender.send(message);
    }

    @Async
    public void sendVerificationTokenByEmail(
        final UUID userId,
        final String email
    ) {
        final var token = otpService.generateAndStoreOtp(userId);

        final var emailVerificationUrl = "%s/verified/%s/%s"
            .formatted(clientUrl, userId, token);

        final var context = new Context();
        context.setVariable("verifyLink", emailVerificationUrl);

        final var htmlContent = this.templateEngine.process("VerificationTokenEmail.html", context);
        final var message = CreateMessage(
                EmailConstants.VERIFICATION_MAIL_SUBJECT, EmailConstants.EMAIL_SENDER, email, htmlContent);
        mailSender.send(message);
    }

    private MimeMessage CreateMessage(
            String subject,
            String from,
            String to,
            String text
    ){
        final var message = mailSender.createMimeMessage();
        final MimeMessageHelper helper;
        try {
            helper = new MimeMessageHelper(message, true, EmailConstants.ENCODING);
            helper.setSubject(subject);
            helper.setFrom(from);
            helper.setTo(to);
            helper.setText(text, true);
            return message;
        } catch (MessagingException e) {
            throw new MailMessagingException(e.getMessage());
        }
    }

    public void resendVerificationTokenByEmail(String email) {
        final var user = userRepository.findByEmail(email)
            .filter(usr -> !usr.getIsVerified())
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Email not found or already verified"
            ));

        sendVerificationTokenByEmail(user.getId(), user.getEmail());
    }

    @Transactional
    public User verifyEmail(
        final UUID userId,
        final String token
    ) {
        if (!otpService.isOtpValid(userId, token)) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "Token expired of invalid"
            );
        }
        otpService.deleteOtp(userId);

        final var user = userRepository.findById(userId)
            .orElseThrow(() ->
                new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "User account has been deleted"
                ));

        if (user.getIsVerified()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Email is already verified"
            );
        }

        user.setIsVerified(true);
        log.info("User account has been successfully verified: {}", user.getEmail());

        return user;
    }

    @Async
    public void sendAddressChangeNotification(
        final String recipientEmail,
        final String recipientName,
        final String trackingCode,
        final Address oldAddress,
        final Address newAddress,
        final String requestReason
    ) {
        final var context = new Context();
        context.setVariable("name", recipientName);
        context.setVariable("trackingCode", trackingCode);
        context.setVariable("oldAddressLine1", oldAddress.getLine1());
        context.setVariable("oldAddressLine2", oldAddress.getLine2());
        context.setVariable("oldAddressLine3", getAddressLine3(
            oldAddress.getCity(),
            oldAddress.getCountry(),
            oldAddress.getPostalCode()));
        context.setVariable("newAddressLine1", newAddress.getLine1());
        context.setVariable("newAddressLine2", newAddress.getLine2());
        context.setVariable("newAddressLine3", getAddressLine3(
            newAddress.getCity(),
            newAddress.getCountry(),
            newAddress.getPostalCode()));
        context.setVariable("reason", requestReason != null && !requestReason.trim().isEmpty() ? "Reason: " + requestReason : "");

        final var htmlContent = this.templateEngine.process("AddressChangeNotificationEmail.html", context);

        final var message = CreateMessage(
            EmailConstants.ADDRESS_CHANGE_MAIL_SUBJECT + trackingCode,
            EmailConstants.EMAIL_SENDER,
            recipientEmail,
            htmlContent
        );

        mailSender.send(message);
        log.info("Address change notification email sent to {} for parcel {}", recipientEmail, trackingCode);
    }

    public void sendPasswordResetEmail(
        final String email,
        final String resetLink
    ) {
        final var emailText = """
            Hello,
            
            You requested a password reset for your DHV account. 
            
            Click the link below to reset your password:
            %s
            
            if you didn't request this, please ignore this email.
            
            Regards,
            DHV Team
            """.formatted(resetLink);

        final var message = CreateMessage(
            "Password Reset Request",
            EmailConstants.EMAIL_SENDER,
            email,
            emailText
        );

        mailSender.send(message);
        log.info("Password reset email sent to {}", email);
    }

    private String getAddressLine3(String city, String country, String postalCode){
        return city + ", " + country + " " + postalCode;
    }

    public void sendParcelStatusChangeNotification(
        final String email,
        final String status,
        final String trackingCode
    ){
        final var context = new Context();
        context.setVariable("status", status);
        context.setVariable("trackingCode", trackingCode);
        context.setVariable("trackingUrl", clientUrl + EmailConstants.TRACKING_PAGE_URL_ROUTE + trackingCode);

        final var htmlContext = this.templateEngine.process("ParcelStatusChangedEmail.html", context);

        final var message = CreateMessage(
            EmailConstants.STATUS_UPDATE_MAIl_SUBJECT + trackingCode,
            EmailConstants.EMAIL_SENDER,
            email,
            htmlContext
        );
        mailSender.send(message);
        log.info("Parcel status change notification email sent to {} for parcel {}", email, trackingCode);
    }

    public void sendPasswordChangeRequest(final String email) {
        final var htmlContext = this.templateEngine.process("PasswordChangeRequestEmail.html", new Context());

        final var message = CreateMessage(
            EmailConstants.PASSWORD_CHANGE_MAIL_SUBJECT,
            EmailConstants.EMAIL_SENDER,
            email,
            htmlContext
        );
        mailSender.send(message);
        log.info("Change password notification email sent to {}", email);
    }
    public void sendUserUpdatedNotification(
        final String email,
        final User oldUser,
        final User newUser
    ){
        final var context = new Context();
        context.setVariable("oldName", oldUser.getName());
        context.setVariable("oldEmail", oldUser.getEmail());
        context.setVariable("oldPhone", oldUser.getPhone());
        context.setVariable("oldAddressLine1", oldUser.getAddress().getLine1());
        context.setVariable("oldAddressLine2", oldUser.getAddress().getLine2());
        context.setVariable("oldAddressLine3", getAddressLine3(
            oldUser.getAddress().getCity(),
            oldUser.getAddress().getCountry(),
            oldUser.getAddress().getPostalCode()));
        context.setVariable("newName", newUser.getName());
        context.setVariable("newEmail", newUser.getEmail());
        context.setVariable("newPhone", newUser.getPhone());
        context.setVariable("newAddressLine1", newUser.getAddress().getLine1());
        context.setVariable("newAddressLine2", newUser.getAddress().getLine2());
        context.setVariable("newAddressLine3", getAddressLine3(
                newUser.getAddress().getCity(),
                newUser.getAddress().getCountry(),
                newUser.getAddress().getPostalCode()));

        final var htmlContect = this.templateEngine.process("UserUpdatedEmail.html", context);

        final var message = CreateMessage(
            EmailConstants.USER_UPDATE_MAIL_SUBJECT,
            EmailConstants.EMAIL_SENDER,
            email,
            htmlContect
        );
        mailSender.send(message);
        log.info("User update notification email sent to {}", email);
    }

}

