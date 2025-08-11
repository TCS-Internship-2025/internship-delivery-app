package com.tcs.dhv.domain.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum RecipientTitle {
    MR("Mr"),
    MS("Ms"),
    MRS("Mrs"),
    MISS("Miss"),
    DR("Dr"),
    PROF("Prof"),
    MX("Mx"),
    SIR("Sir"),
    MADAM("Madam"),
    REV("Rev"),
    CAPT("Capt"),
    MAJOR("Major"),
    COL("Col"),
    LT("Lt"),
    FR("Fr"),
    SR("Sr");

    private final String displayName;

    @Override
    public String toString() {
        return displayName;
    }
}