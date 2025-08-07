ALTER TABLE parcels
    ADD COLUMN IF NOT EXISTS address_id UUID;

UPDATE parcels
    SET address_id = recipients.address_id
    FROM recipients
    WHERE parcels.recipient_id = recipients.id;

ALTER TABLE parcels
    ADD CONSTRAINT fk_parcels_address
        FOREIGN KEY (address_id) REFERENCES addresses(id);

ALTER TABLE parcels
    ALTER COLUMN address_id SET NOT NULL;

ALTER TABLE recipients
    DROP CONSTRAINT IF EXISTS recipients_address_fk;

ALTER TABLE recipients
    DROP COLUMN IF EXISTS address_id;