package com.tcs.dhv.dto;

import java.util.Optional;

public record AddressUpdateDto(
        Optional<String> addressName,

        Optional<String> line1,

        Optional<String> line2,

        Optional<String> building,

        Optional<String> apartment,

        Optional<String> city,

        Optional<String> postalCode,

        Optional<String> country
) {}
