package com.tcs.dhv.config;

import com.tcs.dhv.util.Constants;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

@Configuration
public class MailConfig {

    @Value("${MAIL_USERNAME}")
    private String username;

    @Value("${MAIL_PASSWORD}")
    private String password;

    private static final String host = "smtp.gmail.com";
    private static final int port = 587;

    @Bean
    public JavaMailSender javaMailSender() {
        final var mailSender = new JavaMailSenderImpl();
        mailSender.setHost(host);
        mailSender.setPort(port);
        mailSender.setUsername(username);
        mailSender.setPassword(password);

        final var props = mailSender.getJavaMailProperties();
        props.put(Constants.mailProtocol, "smtp");
        props.put(Constants.mailAuth, "true");
        props.put(Constants.mailStarttlsEnable,"true");
        props.put(Constants.mailDebug,"true");

        return mailSender;
    }

    @Bean
    SimpleMailMessage templateShipmentMessage(){
        final var mail = new SimpleMailMessage();
        mail.setFrom(username);
        mail.setSubject(Constants.mailSubject);
        mail.setText("Your package %s is on the way\n Click the following link to see its status: %s");

        return mail;
    }
}
