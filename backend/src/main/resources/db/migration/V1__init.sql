CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;

-- TABLES

CREATE TABLE addresses (
    id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    line1       text NOT NULL,
    line2       text,
    building    text,
    apartment   text,
    city        text NOT NULL,
    postal_code text NOT NULL,
    country     text DEFAULT 'Hungary' NOT NULL,
    latitude    double precision,
    longitude   double precision
);

CREATE TABLE users (
    id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name        text NOT NULL,
    email       text NOT NULL UNIQUE,
    password    text NOT NULL,
    phone       text,
    address_id  uuid,
    created_at  timestamptz DEFAULT now() NOT NULL,
    is_verified boolean DEFAULT false NOT NULL
);

CREATE TABLE parcels (
    id                      uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id               uuid NOT NULL,
    recipient_address_id    uuid NOT NULL,
    delivery_type           varchar(20) NOT NULL,
    tracking_code           text NOT NULL UNIQUE,
    payment_type            varchar(20) NOT NULL,
    current_status          varchar(30) DEFAULT 'CREATED' NOT NULL,
    created_at              timestamptz DEFAULT now() NOT NULL,
    updated_at              timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE predefined_locations (
    id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name        text NOT NULL,
    type        varchar(20) NOT NULL,
    status      text NOT NULL,
    address_id  uuid
);

CREATE SEQUENCE parcel_status_history_id_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE parcel_status_history (
    id          bigint PRIMARY KEY DEFAULT nextval('parcel_status_history_id_seq'),
    parcel_id   uuid NOT NULL,
    status      varchar(30) NOT NULL,
    description text,
    "timestamp" timestamptz DEFAULT now() NOT NULL
);

-- FOREIGN KEYS

ALTER TABLE users
    ADD CONSTRAINT users_address_id_fkey
        FOREIGN KEY (address_id) REFERENCES addresses(id);

ALTER TABLE parcels
    ADD CONSTRAINT parcels_sender_id_fkey
        FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE parcels
    ADD CONSTRAINT parcels_recipient_address_id_fkey
        FOREIGN KEY (recipient_address_id) REFERENCES addresses(id);

ALTER TABLE predefined_locations
    ADD CONSTRAINT predefined_locations_address_id_fkey
        FOREIGN KEY (address_id) REFERENCES addresses(id);

ALTER TABLE parcel_status_history
    ADD CONSTRAINT parcel_status_history_parcel_id_fkey
        FOREIGN KEY (parcel_id) REFERENCES parcels(id) ON DELETE CASCADE;

-- TRIGGER FUNCTIONS

CREATE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION sync_current_status() RETURNS trigger AS $$
BEGIN
    UPDATE parcels
    SET current_status = NEW.status,
        updated_at     = NEW.timestamp
    WHERE id = NEW.parcel_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- TRIGGERS

CREATE TRIGGER trg_set_updated_at
    BEFORE UPDATE ON parcels
    FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_sync_status
    AFTER INSERT ON parcel_status_history
    FOR EACH ROW
EXECUTE FUNCTION sync_current_status();
