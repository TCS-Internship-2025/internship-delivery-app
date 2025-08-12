package com.tcs.dhv.util;

public class PhoneNumberUtil {
    private PhoneNumberUtil() {}

    public static String normalizePhone(String phone) {
        if (phone == null) return null;

        String digitsOnly = phone.replaceAll("\\D", "");

        if (digitsOnly.startsWith("0036")) {
            return "+36" + digitsOnly.substring(4);
        } else if (digitsOnly.startsWith("06")) {
            return "+36" + digitsOnly.substring(2);
        } else if (digitsOnly.startsWith("36")) {
            return "+" + digitsOnly;
        }

        return "+" + digitsOnly;
    }
}
