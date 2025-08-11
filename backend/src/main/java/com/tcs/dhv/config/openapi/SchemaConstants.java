package com.tcs.dhv.config.openapi;

public class SchemaConstants {
    public static final String PASSWORD_DESC = "User's password";
    public static final String PASSWORD_EX = "40!OpenSesame";
    public static final String NAME_DESC = "Full name";
    public static final String NAME_EX = "Ferenc Kiss";
    public static final String EMAIL_DESC = "Email address";
    public static final String EMAIL_EX = "ferenckiss19823010@gmail.com";

    public static final String PARCEL_ID_DESC = "Unique identifier of the parcel";
    public static final String PARCEL_ID_EX = "123e4567-e89b-12d3-a456-426614174000";
    public static final String TRACKING_CODE_DESC = "Unique tracking code for the parcel (format: HU + 10 digits + 2 letters)";
    public static final String TRACKING_CODE_EX = "HU2606574833TV";

    public static final String ADDRESS_LINE1_DESC = "Primary address line (street name and number)";
    public static final String ADDRESS_LINE1_EX = "Váci út 1-3";
    public static final String ADDRESS_LINE2_DESC = "Secondary address line (floor, suite, etc.)";
    public static final String ADDRESS_LINE2_EX = "1st Floor";
    public static final String ADDRESS_BUILDING_DESC = "Building identifier or name";
    public static final String ADDRESS_BUILDING_EX = "Building A";
    public static final String ADDRESS_APARTMENT_DESC = "Apartment or unit number";
    public static final String ADDRESS_APARTMENT_EX = "12B";
    public static final String ADDRESS_CITY_DESC = "City name";
    public static final String ADDRESS_CITY_EX = "Budapest";
    public static final String ADDRESS_POSTAL_DESC = "Postal code";
    public static final String ADDRESS_POSTAL_EX = "1062";
    public static final String ADDRESS_COUNTRY_DESC = "Country name";
    public static final String ADDRESS_COUNTRY_EX = "Hungary";
    public static final String ADDRESS_LATITUDE_DESC = "Geographical latitude coordinate";
    public static final String ADDRESS_LATITUDE_EX = "47.5108";
    public static final String ADDRESS_LONGITUDE_DESC = "Geographical longitude coordinate";
    public static final String ADDRESS_LONGITUDE_EX = "19.0573";

    public static final String RECIPIENT_TITLE_DESC = "Title of the recipient";
    public static final String RECIPIENT_TITLE_EX = "MR";
    public static final String RECIPIENT_NAME_DESC = "Full name of the parcel recipient";
    public static final String RECIPIENT_NAME_EX = "Miklós Tóth";
    public static final String RECIPIENT_EMAIL_DESC = "Email address of the parcel recipient";
    public static final String RECIPIENT_EMAIL_EX = "miklos.toth@example.com";
    public static final String RECIPIENT_PHONE_DESC = "Phone number of the recipient (optional)";
    public static final String RECIPIENT_PHONE_EX = "+36309876543";
    public static final String RECIPIENT_BIRTH_DATE_DESC = "Recipient's date of birth";
    public static final String RECIPIENT_BIRTH_DATE_EX = "1988-06-22";

    public static final String PARCEL_ADDRESS_DESC = "Delivery address for the parcel";
    public static final String PARCEL_RECIPIENT_DESC = "Recipient information for the parcel";
    public static final String PARCEL_STATUS_DESC = "Current status of the parcel";
    public static final String PARCEL_STATUS_EX = "CREATED";
    public static final String PARCEL_DELIVERY_TYPE_DESC = "Type of delivery (HOME or PICKUP_POINT)";
    public static final String PARCEL_DELIVERY_TYPE_EX = "HOME";
    public static final String PARCEL_PAYMENT_TYPE_DESC = "Who pays for the delivery";
    public static final String PARCEL_PAYMENT_TYPE_EX = "SENDER_PAYS";
    public static final String PARCEL_CREATED_AT_DESC = "Timestamp when the parcel was created";
    public static final String PARCEL_CREATED_AT_EX = "2025-08-07T14:21:44";
    public static final String PARCEL_UPDATED_AT_DESC = "Timestamp when the parcel was last updated";
    public static final String PARCEL_UPDATED_AT_EX = "2025-08-07T14:21:44";
}
