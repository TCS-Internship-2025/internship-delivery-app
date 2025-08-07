package com.tcs.dhv.domain.enums;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public enum ParcelStatus {
    CREATED("Created"),
    PICKED_UP("Picked up"),
    IN_TRANSIT("In Transit"),
    OUT_FOR_DELIVERY("Out for delivery"),
    DELIVERED("Delivered"),
    CANCELLED("Cancelled"),
    DELIVERY_ATTEMPTED("Attempted Delivery"),
    RETURNED_TO_SENDER("Returned to sender");

    private final String label;

    @Override
    public String toString() {
        return label;
    }


}
