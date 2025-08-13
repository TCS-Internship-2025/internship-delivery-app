package com.tcs.dhv.domain.event;

import com.tcs.dhv.domain.entity.Address;
import com.tcs.dhv.domain.entity.Parcel;

public record ParcelAddressChangedEvent (
    Address oldAddress,
    Address newAddress,
    Parcel parcel,
    String reason
){
}
