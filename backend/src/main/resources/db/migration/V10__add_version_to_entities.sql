ALTER TABLE addresses
    ADD COLUMN version BIGINT NOT NULL DEFAULT 0;

ALTER TABLE parcels
    ADD COLUMN version BIGINT NOT NULL DEFAULT 0;

ALTER TABLE recipients
    ADD COLUMN version BIGINT NOT NULL DEFAULT 0;

ALTER TABLE users
ADD COLUMN version BIGINT NOT NULL DEFAULT 0;

UPDATE addresses SET version = 0 WHERE version IS NULL;
UPDATE parcels SET version = 0 WHERE version IS NULL;
UPDATE recipients SET version = 0 WHERE version IS NULL;
UPDATE users SET version = 0 WHERE version IS NULL;