-- Migration: Add Google Authentication Support
-- Description: Adds google_id and email_verified columns to users table for Google Sign-In
-- Date: 2026-06-15

-- Add google_id column to users table
-- Note: This will fail if column already exists, which is okay
ALTER TABLE users
ADD COLUMN google_id VARCHAR(255) DEFAULT NULL AFTER password;

-- Add unique index on google_id
ALTER TABLE users
ADD UNIQUE KEY google_id_unique (google_id);

-- Add email_verified column
ALTER TABLE users
ADD COLUMN email_verified TINYINT(1) DEFAULT 0 AFTER google_id;

-- Update existing Google users to mark email as verified
UPDATE users
SET email_verified = 1
WHERE google_id IS NOT NULL AND google_id != '';
