package com.tcs.dhv.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@Configuration
public class MailConfig {

    @Value("${MAIL_USERNAME}")
    private String username;

    @Value("${MAIL_PASSWORD}")
    private String password;

    @Bean
    public JavaMailSender javaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost("smtp.gmail.com");
        mailSender.setPort(587);
        mailSender.setUsername(username);
        mailSender.setPassword(password);

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable","true");
        props.put("mail.debug","true");

        return mailSender;
    }

    @Bean
    SimpleMailMessage templateShipmentMessage(){
        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setFrom("noreply@tcs.interns.com");
        mail.setSubject("Shipment label");
        mail.setText("Your package %s is on the way\n Click the following link to see its status: %s");

        return mail;
    }
}
