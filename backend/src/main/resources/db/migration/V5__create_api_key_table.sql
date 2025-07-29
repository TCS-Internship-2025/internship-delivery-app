CREATE TABLE api_keys(
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    hashed_key TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    last_updated TIMESTAMP
)