ALTER TABLE users
    ADD COLUMN updated_at timestamptz DEFAULT now() NOT NULL;

UPDATE users SET updated_at = created_at WHERE updated_at IS NULL;