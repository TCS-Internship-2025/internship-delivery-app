package com.tcs.dhv.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = TrackingCodeValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface TrackingCode {
    String message() default "Tracking code is invalid or not found";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
