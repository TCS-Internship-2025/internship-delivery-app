ALTER TABLE parcels
    ADD COLUMN address_id UUID;

ALTER TABLE parcels
    ALTER COLUMN address_id SET NOT NULL;

ALTER TABLE parcels
    ADD CONSTRAINT fk_parcels_address
        FOREIGN KEY (address_id) REFERENCES addresses(id);

ALTER TABLE parcels
    DROP COLUMN IF EXISTS pickup_point_id,
    DROP COLUMN IF EXISTS parcel_box_id,
    DROP COLUMN IF EXISTS delivery_zone_id;