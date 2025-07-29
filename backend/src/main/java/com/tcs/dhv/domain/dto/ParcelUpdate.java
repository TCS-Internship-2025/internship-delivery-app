package com.tcs.dhv.domain.dto;

import com.tcs.dhv.domain.enums.DeliveryType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;

@Schema(description = "Request to update parcel information")
public record ParcelUpdate(
    @Schema(description = "Updated address information for the parcel")
    @Valid
    AddressUpdate address,

    @Schema(description = "Updated delivery type", example = "HOME")
    DeliveryType deliveryType
) {
}
