ALTER TABLE recipients
    DROP CONSTRAINT IF EXISTS recipients_address_fk;

ALTER TABLE recipients
    DROP COLUMN IF EXISTS address_id;

ALTER TABLE parcels
    ADD COLUMN IF NOT EXISTS recipient_address_id UUID;

ALTER TABLE parcels
    DROP CONSTRAINT IF EXISTS parcels_recipient_address_id_fkey;

ALTER TABLE parcels
    ADD CONSTRAINT parcels_recipient_address_id_fkey
        FOREIGN KEY (recipient_address_id)
            REFERENCES addresses(id)
            ON DELETE RESTRICT;