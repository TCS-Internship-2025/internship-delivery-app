package com.tcs.dhv.domain.event;

import com.tcs.dhv.domain.entity.Parcel;

public record ParcelCreatedEvent(
    Parcel parcel
) {
}