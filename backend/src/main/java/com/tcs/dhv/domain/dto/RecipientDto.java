package com.tcs.dhv.domain.dto;

import com.tcs.dhv.config.openapi.SchemaConstants;
import com.tcs.dhv.domain.entity.Recipient;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.io.Serializable;
import java.time.LocalDate;

@Schema(description = "Recipient information for parcel delivery")
public record RecipientDto(
    @Schema(description = SchemaConstants.NAME_DESC, example = SchemaConstants.NAME_EX,
        requiredMode = Schema.RequiredMode.REQUIRED)
    @Size(min = 1, max = 100, message = "Name must be between {min} and {max} characters")
    String name,

    @Schema(description = SchemaConstants.EMAIL_DESC, example = SchemaConstants.EMAIL_EX,
        requiredMode = Schema.RequiredMode.REQUIRED)
    @Email(message = "Invalid email format")
    @Size(max = 254, message = "Email cannot exceed {max} characters")
    String email,

    @Schema(description = "Recipient's phone number", example = "+36309876543")
    @Pattern(regexp = "^(\\+36|0036|06)((20|30|31|50|70)[0-9]{7}|1[0-9]{8}|((?!(97|98|86|81|67|65|64|61|60|58|51|43|41|40|39))[2-9][0-9])[0-9]{7})$",
        message = "Invalid Hungarian phone number format (+36XXXXXXXXX)")
    String phone,

    @Schema(description = "Recipient's birthday", example = "2000-12-12")
    @Past(message = "Date of birth must be in the past")
    LocalDate birthDate

) implements Serializable {
    public static RecipientDto fromEntity(final Recipient recipient) {
        return new RecipientDto(
            recipient.getName(),
            recipient.getEmail(),
            recipient.getPhone(),
            recipient.getBirthDate()
         );
    }
}
