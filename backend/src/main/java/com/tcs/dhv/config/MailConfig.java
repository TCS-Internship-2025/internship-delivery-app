package com.tcs.dhv.config;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.spring6.SpringTemplateEngine;
import org.thymeleaf.templatemode.TemplateMode;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;
import org.thymeleaf.templateresolver.ITemplateResolver;

import static com.tcs.dhv.util.EmailConstants.ENCODING;
import static com.tcs.dhv.util.EmailConstants.MAIL_AUTH;
import static com.tcs.dhv.util.EmailConstants.MAIL_DEBUG;
import static com.tcs.dhv.util.EmailConstants.MAIL_HOST;
import static com.tcs.dhv.util.EmailConstants.MAIL_PORT;
import static com.tcs.dhv.util.EmailConstants.MAIL_PROPERTY_ENABLED;
import static com.tcs.dhv.util.EmailConstants.MAIL_PROTOCOL;
import static com.tcs.dhv.util.EmailConstants.EMAIL_PROTOCOL;
import static com.tcs.dhv.util.EmailConstants.MAIL_STARTTLS_ENABLE;
import static com.tcs.dhv.util.EmailConstants.RESOLVER_PREFIX;
import static com.tcs.dhv.util.EmailConstants.RESOLVER_SUFFIX;

@Configuration
public class MailConfig {

    @Value("${MAIL_USERNAME}")
    private String username;

    @Value("${MAIL_PASSWORD}")
    private String password;

    private static final String HOST = MAIL_HOST;
    private static final int PORT = MAIL_PORT;

    @Bean
    public JavaMailSender javaMailSender() {
        final var mailSender = new JavaMailSenderImpl();
        mailSender.setHost(HOST);
        mailSender.setPort(PORT);
        mailSender.setUsername(username);
        mailSender.setPassword(password);

        final var props = mailSender.getJavaMailProperties();
        props.put(MAIL_PROTOCOL, EMAIL_PROTOCOL);
        props.put(MAIL_AUTH, MAIL_PROPERTY_ENABLED);
        props.put(MAIL_STARTTLS_ENABLE, MAIL_PROPERTY_ENABLED);
        props.put(MAIL_DEBUG, MAIL_PROPERTY_ENABLED);

        return mailSender;
    }

    @Bean
    public TemplateEngine emailTemplateEngine(){
        final var templateEngine = new SpringTemplateEngine();
        templateEngine.addTemplateResolver(htmlTemplateResolver());
        return templateEngine;
    }

    private ITemplateResolver htmlTemplateResolver() {
        final var resolver = new ClassLoaderTemplateResolver();
        resolver.setPrefix(RESOLVER_PREFIX);
        resolver.setSuffix(RESOLVER_SUFFIX);
        resolver.setTemplateMode(TemplateMode.HTML);
        resolver.setCharacterEncoding(ENCODING);
        resolver.setCacheable(false);
        return resolver;
    }

    @Bean
    SimpleMailMessage templateShipmentMessage() {
        final var mail = new SimpleMailMessage();
        mail.setFrom(username);
        return mail;
    }


}