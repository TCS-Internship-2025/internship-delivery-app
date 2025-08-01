package com.tcs.dhv.service;

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

        final var emailVerificationUrl = "%s/api/auth/email/verify?uid=%s&t=%s"
            .formatted(appBaseUrl, userId, token);

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



}
