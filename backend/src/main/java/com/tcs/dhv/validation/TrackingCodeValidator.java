package com.tcs.dhv.validation;

import com.tcs.dhv.repository.ParcelRepository;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

@AllArgsConstructor
@Component
public class TrackingCodeValidator implements ConstraintValidator<TrackingCode, String> {

    private final String TRACKING_CODE_REGEX = "^HU\\d{10}[A-Z]{2}$";
    private final ParcelRepository parcelRepository;

    @Override
    public void initialize(final TrackingCode constraintAnnotation) {
        ConstraintValidator.super.initialize(constraintAnnotation);
    }

    @Override
    public boolean isValid(
        final String trackingCode,
        final ConstraintValidatorContext constraintValidatorContext
    ) {
        if (trackingCode == null || trackingCode.isBlank()) {
            return false;
        }

        if (!trackingCode.matches(TRACKING_CODE_REGEX)) {
            constraintValidatorContext.disableDefaultConstraintViolation();
            constraintValidatorContext.buildConstraintViolationWithTemplate(
                "Tracking code must start with 'HU', " +
                    "followed by 10 digits, and end with 2 uppercase letters (e.g., HU1234567890AA)"
                ).addConstraintViolation();
            return false;
        }

        if (!parcelRepository.existsByTrackingCode(trackingCode)) {
            constraintValidatorContext.disableDefaultConstraintViolation();
            constraintValidatorContext.buildConstraintViolationWithTemplate(
                "Tracking code not found."
                ).addConstraintViolation();
            return false;
        }

        return true;
    }
}
