-- Add email verification columns to users table
-- Run this migration to enable email verification feature

ALTER TABLE users
ADD COLUMN email_verified TINYINT(1) DEFAULT 0 COMMENT 'Whether email has been verified (0 = no, 1 = yes)',
ADD COLUMN email_verification_token VARCHAR(255) NULL COMMENT 'Token for email verification',
ADD COLUMN email_verification_expires_at DATETIME NULL COMMENT 'When the verification token expires',
ADD INDEX idx_verification_token (email_verification_token),
ADD INDEX idx_email_verified (email_verified);

-- Set existing users as verified (optional - comment out if you want to require verification for all)
-- UPDATE users SET email_verified = 1 WHERE email_verification_token IS NULL;
