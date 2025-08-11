-- Remove unique constraint from recipients email column to allow multiple recipients with same email
-- This enables different people sharing an email address to be distinct recipients

ALTER TABLE recipients DROP CONSTRAINT recipients_email_key;