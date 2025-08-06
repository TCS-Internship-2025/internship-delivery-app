package com.tcs.dhv.domain.dto;

import com.tcs.dhv.domain.enums.ParcelStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record StatusUpdateDto(

        @NotNull(message = "A new status is required")
        ParcelStatus status,

        @Size(max = 500, message = "Description cannot exceed {max} characters")
        String description

) {

}
