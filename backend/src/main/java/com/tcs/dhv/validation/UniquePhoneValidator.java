package com.tcs.dhv.validation;

import com.tcs.dhv.repository.UserRepository;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UniquePhoneValidator implements ConstraintValidator<UniquePhone, String> {
    private final UserRepository userRepository;

    @Override
    public boolean isValid(final String phone, final ConstraintValidatorContext context) {
        if(phone == null || phone.isEmpty()) return true;

        return userRepository.existsByPhone(phone);
    }
}
