ALTER TABLE users
    ADD COLUMN updated_at timestamp DEFAULT now() NOT NULL;

UPDATE users SET updated_at = created_at;