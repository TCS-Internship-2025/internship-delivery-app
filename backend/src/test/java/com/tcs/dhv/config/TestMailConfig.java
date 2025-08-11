package com.tcs.dhv.config;

import com.tcs.dhv.util.EmailConstants;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

@TestConfiguration
public class TestMailConfig {
    @Bean
    @Primary
    public JavaMailSender testJavaMailSender() {
        JavaMailSenderImpl sender = new JavaMailSenderImpl();
        sender.setHost("localhost");
        sender.setPort(EmailConstants.TEST_MAIL_PORT);
        sender.setProtocol(EmailConstants.EMAIL_PROTOCOL);
        return sender;
    }
}
