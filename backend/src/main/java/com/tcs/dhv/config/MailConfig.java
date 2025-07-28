package com.tcs.dhv.config;

import com.tcs.dhv.util.EmailConstants;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import static com.tcs.dhv.util.EmailConstants.EMAIL_PROTOCOL;
import static com.tcs.dhv.util.EmailConstants.MAIL_AUTH;
import static com.tcs.dhv.util.EmailConstants.MAIL_DEBUG;
import static com.tcs.dhv.util.EmailConstants.MAIL_PROTOCOL;
import static com.tcs.dhv.util.EmailConstants.MAIL_STARTTLS_ENABLE;
import static com.tcs.dhv.util.EmailConstants.TRUE;

@Configuration
public class MailConfig {

    @Value("${MAIL_USERNAME}")
    private String username;

    @Value("${MAIL_PASSWORD}")
    private String password;

    private static final String HOST = "smtp.gmail.com";
    private static final int PORT = 587;

    @Bean
    public JavaMailSender javaMailSender() {
        final var mailSender = new JavaMailSenderImpl();
        mailSender.setHost(HOST);
        mailSender.setPort(PORT);
        mailSender.setUsername(username);
        mailSender.setPassword(password);

        final var props = mailSender.getJavaMailProperties();
        props.put(MAIL_PROTOCOL, EMAIL_PROTOCOL);
        props.put(MAIL_AUTH, TRUE);
        props.put(MAIL_STARTTLS_ENABLE, TRUE);
        props.put(MAIL_DEBUG, TRUE);

        return mailSender;
    }

    @Bean
    SimpleMailMessage templateShipmentMessage() {
        final var mail = new SimpleMailMessage();
        mail.setFrom(username);
        mail.setSubject(EmailConstants.MAIL_SUBJECT);
        mail.setText("Your package %s is on the way\n Click the following link to see its status: %s");

        return mail;
    }
}
