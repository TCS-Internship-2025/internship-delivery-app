-- 1. Create recipients table
CREATE TABLE recipients
(
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name       TEXT NOT NULL,
    email      TEXT NOT NULL UNIQUE,
    phone      TEXT,
    birth_date DATE,
    address_id UUID NOT NULL,
    CONSTRAINT recipients_address_fk
        FOREIGN KEY (address_id)
            REFERENCES addresses (id)
            ON DELETE CASCADE
);

-- 2. Modify parcels table
ALTER TABLE parcels DROP CONSTRAINT parcels_recipient_address_id_fkey;

ALTER TABLE parcels DROP COLUMN recipient_address_id;

ALTER TABLE parcels
    ADD COLUMN recipient_id UUID NOT NULL;

ALTER TABLE parcels
    ADD CONSTRAINT parcels_recipient_id_fk
        FOREIGN KEY (recipient_id)
            REFERENCES recipients (id)
            ON DELETE CASCADE;
