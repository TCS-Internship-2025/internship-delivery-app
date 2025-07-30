-- V5__create_api_keys.sql

CREATE TABLE IF NOT EXISTS api_keys(
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    hashed_key TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    last_updated TIMESTAMP
);

INSERT INTO api_keys (
    id,
    name,
    hashed_key,
    created_at,
    active,
    last_updated
) VALUES (
    'a12b34c5-d678-90ef-1234-56789abcdef0',
    'Test API Key',
    '$2a$10$5Ny57pJ/qSdhnOL7Busef.BDvcddBQ9sT8RNBTroNZtv7lolFlyzC',
    NOW(),
    TRUE,
    NOW()
);
