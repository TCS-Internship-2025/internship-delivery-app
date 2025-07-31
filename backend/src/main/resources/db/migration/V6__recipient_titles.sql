CREATE TYPE recipient_title AS ENUM ('Mr', 'Ms', 'Mrs', 'Miss', 'Dr', 'Prof', 'Mx', 'Sir', 'Madam', 'Rev', 'Capt', 'Major', 'Col', 'Lt', 'Fr', 'Sr');

ALTER TABLE recipients ADD COLUMN title recipient_title;
