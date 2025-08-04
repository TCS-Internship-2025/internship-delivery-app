package com.tcs.dhv.validation;

import com.tcs.dhv.repository.ParcelRepository;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;


@Component
@AllArgsConstructor
public class TrackingCodeValidator implements ConstraintValidator<TrackingCode, String> {

    private final String TRACKING_CODE_REGEX = "^HU\\d{10}[A-Z]{2}$";
    private final ParcelRepository parcelRepository;


    @Override
    public void initialize(TrackingCode constraintAnnotation) {
        ConstraintValidator.super.initialize(constraintAnnotation);
    }

    @Override
    public boolean isValid(String trackingCode, ConstraintValidatorContext constraintValidatorContext) {

        if(trackingCode == null || trackingCode.isBlank()){
            //to be handled by @NotNull or @NotBlank
            return true;
        }

        //check pattern
        if(!trackingCode.matches(TRACKING_CODE_REGEX)){
            constraintValidatorContext.disableDefaultConstraintViolation();
            constraintValidatorContext.buildConstraintViolationWithTemplate("Tracking code must start with 'HU', " +
                    "followed by 10 digits, and end with 2 uppercase letters (e.g., HU1234567890AA)")
                    .addConstraintViolation();
            return false;
        }

        //check existence
        if (!parcelRepository.existsByTrackingCode(trackingCode)) {
            constraintValidatorContext.disableDefaultConstraintViolation();
            constraintValidatorContext.buildConstraintViolationWithTemplate("Tracking code not found.")
                    .addConstraintViolation();
            return false;
        }

        return true;
    }
}
