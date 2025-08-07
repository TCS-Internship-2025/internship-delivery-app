package com.tcs.dhv.util;

import lombok.experimental.UtilityClass;

@UtilityClass
public class EmailConstants {
    public static final String MAIL_PROTOCOL = "mail.transport.protocol";
    public static final String MAIL_AUTH = "mail.smtp.auth";
    public static final String MAIL_STARTTLS_ENABLE = "mail.smtp.starttls.enable";
    public static final String MAIL_DEBUG = "mail.debug";

    public static final String SHIPMENT_MAIL_SUBJECT = "Shipment is on the way";
    public static final String EMAIL_PROTOCOL = "smtp";
    public static final String MAIL_PROPERTY_ENABLED = "true";

    public static final String VERIFICATION_MAIL_SUBJECT = "Email Verification Token";
    public static final String EMAIL_SENDER = "noreply@dhv.com";
    public static final String ENCODING = "UTF-8";
    public static final String DELIVERY_COMPLETE_SUBJECT = "Delivery is complete";
    public static final String TRACKING_PAGE_URL_ROUTE = "/tracking/";
    public static final String ADDRESS_CHANGE_MAIL_SUBJECT = "Delivery Address Changed - ";
    public static final String STATUS_UPDATE_MAIl_SUBJECT = "Delivery Status Changed - ";
    public static final String PASSWORD_CHANGE_MAIL_SUBJECT = "Password successfully changed";
    public static final String USER_UPDATE_MAIL_SUBJECT = "User profile successfully updated";

}
