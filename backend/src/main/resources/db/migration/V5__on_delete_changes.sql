ALTER TABLE parcels
DROP CONSTRAINT parcels_sender_id_fkey;

ALTER TABLE parcels
    ADD CONSTRAINT parcels_sender_id_fkey
        FOREIGN KEY (sender_id)
            REFERENCES users(id)
            ON DELETE RESTRICT;


ALTER TABLE parcels
DROP CONSTRAINT parcels_recipient_id_fk;

ALTER TABLE parcels
    ADD CONSTRAINT parcels_recipient_id_fk
        FOREIGN KEY (recipient_id)
            REFERENCES recipients(id)
            ON DELETE RESTRICT;


ALTER TABLE parcel_status_history
DROP CONSTRAINT parcel_status_history_parcel_id_fkey;

ALTER TABLE parcel_status_history
    ADD CONSTRAINT parcel_status_history_parcel_id_fkey
        FOREIGN KEY (parcel_id)
            REFERENCES parcels(id)
            ON DELETE RESTRICT;


ALTER TABLE recipients
DROP CONSTRAINT recipients_address_fk;

ALTER TABLE recipients
    ADD CONSTRAINT recipients_address_fk
        FOREIGN KEY (address_id)
            REFERENCES addresses(id)
            ON DELETE RESTRICT;


ALTER TABLE predefined_locations
DROP CONSTRAINT predefined_locations_address_id_fkey;

ALTER TABLE predefined_locations
    ALTER COLUMN address_id SET NOT NULL;

ALTER TABLE predefined_locations
    ADD CONSTRAINT predefined_locations_address_id_fkey
        FOREIGN KEY (address_id)
            REFERENCES addresses(id)
            ON DELETE RESTRICT;
