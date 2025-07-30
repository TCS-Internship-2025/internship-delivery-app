package com.tcs.dhv.service;

import com.tcs.dhv.domain.entity.User;
import com.tcs.dhv.repository.UserRepository;
import com.tcs.dhv.util.EmailConstants;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.mail.SimpleMailMessage;
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
    private final SimpleMailMessage template;

    @Value("${app.base-url}")
    private String appBaseUrl;


    public void sendShipmentCreationEmail(
        final String email,
        final String trackingNumber,
        final String link
    ) throws MessagingException {
        //Prepare the evaluation context
        final Context context = new Context();
        context.setVariable("trackingCode", trackingNumber);
        context.setVariable("trackingUrl", link);

        //Prepare the message using Spring helper
        final MimeMessage message = mailSender.createMimeMessage();
        final MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setSubject(EmailConstants.SHIPMENT_MAIL_SUBJECT);
        helper.setFrom("noreply@dhv.com");
        helper.setTo(email);

        //Add the html to the text
        final String htmlContent = this.templateEngine.process("ShipmentCreationEmail.html", context);
        helper.setText(htmlContent, true);

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

        final var emailText = """
            Hello,
            
            Please verify your email by clicking the link below:
            %s
            
            This link will expire in 15 minutes.
            
            If you did not request this, please ignore this email.
            
            Regards,
            DHV Team
            """.formatted(emailVerificationUrl);

        final var message = template;
        message.setTo(email);
        message.setSubject("Email Verification Token");
        message.setText(emailText);

        mailSender.send(message);
        log.info("Verification email sent to {}", email);
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
