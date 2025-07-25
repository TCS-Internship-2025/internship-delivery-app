package com.tcs.dhv.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private SimpleMailMessage template;

    public final void sendEmail(
            String email,
            String trackingNumber,
            String link
    ) {
        final var message = template;
        Assert.notNull(message.getText(), "Message must not be null;");
        message.setText(String.format(template.getText(), trackingNumber, link));
        message.setTo(email);

        mailSender.send(message);
    }

}
