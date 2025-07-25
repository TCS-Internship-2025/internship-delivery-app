-- TIMESTAMPTZ -> TIMESTAMP
ALTER TABLE users
ALTER COLUMN created_at TYPE timestamp
    USING created_at::timestamp;

ALTER TABLE parcels
ALTER COLUMN created_at TYPE timestamp
    USING created_at::timestamp;
ALTER TABLE parcels
ALTER COLUMN updated_at TYPE timestamp
    USING updated_at::timestamp;

ALTER TABLE parcel_status_history
ALTER COLUMN "timestamp" TYPE timestamp
    USING "timestamp"::timestamp;

-- Making address_id mandatory
ALTER TABLE predefined_locations
    ALTER COLUMN address_id SET NOT NULL;

-- parcel_status_history.id to UUID
BEGIN;

ALTER TABLE parcel_status_history
    ADD COLUMN id_new UUID NOT NULL DEFAULT gen_random_uuid();

ALTER TABLE parcel_status_history
    ALTER COLUMN id DROP DEFAULT;
ALTER TABLE parcel_status_history
    DROP CONSTRAINT parcel_status_history_pkey;

ALTER TABLE parcel_status_history
    DROP COLUMN id;

ALTER TABLE parcel_status_history
    RENAME COLUMN id_new TO id;

ALTER TABLE parcel_status_history
    ADD CONSTRAINT parcel_status_history_pkey PRIMARY KEY (id);

DROP SEQUENCE IF EXISTS parcel_status_history_id_seq;

COMMIT;
