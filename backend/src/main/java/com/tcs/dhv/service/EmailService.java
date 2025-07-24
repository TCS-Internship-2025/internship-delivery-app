package com.tcs.dhv.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private SimpleMailMessage template;

    public void sendEmail(String email, String trackingNumber, String link) {
        SimpleMailMessage message = template;
        assert template.getText() != null;
        message.setText(String.format(template.getText(), trackingNumber, link));
        message.setTo(email);

        mailSender.send(message);
    }

}
