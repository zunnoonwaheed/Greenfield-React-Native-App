# Email Verification Setup Guide

## Overview

Email verification has been implemented for user registration. New users must verify their email address before they can login to the app.

## How It Works

### 1. User Flow

1. User registers with name, email, phone, and password
2. User receives a welcome email with verification link
3. User clicks the verification link in the email
4. App opens to the Email Verification screen
5. Email is automatically verified
6. User is redirected to login
7. User can now login with verified account

### 2. Technical Implementation

#### Database Changes

**New columns in `users` table:**
- `email_verified` - TINYINT(1) - Whether email is verified (0 = no, 1 = yes)
- `email_verification_token` - VARCHAR(255) - Token for email verification
- `email_verification_expires_at` - DATETIME - When the verification token expires

**Migration file:** `/backend/migrations/add_email_verification.sql`

To apply the migration:
```bash
mysql -u root greenfieldsuperm_db_local < backend/migrations/add_email_verification.sql
```

#### Backend (PHP)

**Files Modified:**
- `/backend/api/register.php` - Generates verification token and sends email
- `/backend/api/login.php` - Checks email verification before allowing login
- `/backend/helpers/email.php` - Added `sendEmailVerification()` function

**Files Created:**
- `/backend/api/verify-email.php` - NEW - Verifies email using token

**Email Configuration:**
- Uses PHP's built-in `mail()` function
- Sender: `noreply@greenfield.com`
- Subject: "Verify Your Email - Greenfield SuperMarket"
- HTML email template with branded design
- Verification token expires in 24 hours

**Security Features:**
- Tokens are cryptographically secure (64 character hex)
- Tokens expire after 24 hours
- Used tokens are deleted after verification
- Users cannot login until email is verified

#### Frontend (React Native)

**Files Modified:**
- `/frontend/app.config.js` - Added deep linking for email verification
- `/frontend/App.tsx` - Added VerifyEmail to navigation deep linking
- `/frontend/screens/SignUpScreen.tsx` - Shows verification message after signup
- `/frontend/navigation/AuthStack.tsx` - Added VerifyEmail screen to navigation

**Files Created:**
- `/frontend/api/verifyEmail.js` - NEW - API client for email verification
- `/frontend/screens/VerifyEmailScreen.tsx` - NEW - Email verification UI

**Deep Linking:**
- URL Scheme: `greenfield://verify-email?token=xxx`
- Also supports: `https://greenfieldsupermarket.com/verify-email?token=xxx`
- Automatically opens app when link is clicked
- Navigates to VerifyEmail screen with token parameter

## Email Content

The verification email includes:
- Welcome message with user's name
- Large "Verify Email Address" button
- Copy-pasteable verification link
- 24-hour expiration notice
- Benefits of shopping with Greenfield
- Professional branding and styling

## Testing the Flow

### Development Testing

1. **Register a new user:**
   - Run the app
   - Navigate to Sign Up screen
   - Fill in all fields
   - Click "Sign Up"
   - You'll see a success message with verification instructions

2. **Check backend logs:**
   - Email sending status will be logged
   - Check console for email delivery confirmation

3. **For testing without email:**
   - Backend returns `verification_token` in response (development only)
   - Click "Test Verify (Dev)" button in signup success alert
   - This navigates directly to VerifyEmail screen with token

4. **Test Deep Link:**
```bash
# iOS Simulator
xcrun simctl openurl booted "greenfield://verify-email?token=test-token-123"

# Android Emulator
adb shell am start -W -a android.intent.action.VIEW -d "greenfield://verify-email?token=test-token-123" com.zunnoon.greenfield
```

### Production Testing

1. Register with a real email address you can access
2. Check email inbox (and spam folder)
3. Click the verification link in the email
4. App should open to VerifyEmail screen
5. Email should be verified automatically
6. Verify you can now login

## Error Scenarios

### User Tries to Login Without Verification

**Error message:**
> "Please verify your email address before logging in. Check your inbox for the verification email."

**HTTP Status:** 403 Forbidden

### Token Expired

**Error message:**
> "This verification link has expired or is invalid. Please register again or contact support."

**HTTP Status:** 400 Bad Request

### Email Already Verified

**Success message:**
> "Your email is already verified. You can login now."

**HTTP Status:** 200 OK

### Invalid Token

**Error message:**
> "Invalid or expired verification token. Please request a new verification email."

**HTTP Status:** 400 Bad Request

## Troubleshooting

### Email Not Received

**Check:**
1. Email server is configured and running
2. Check spam/junk folder
3. Verify sender domain has proper DNS records (SPF, DKIM, DMARC)
4. Check server mail logs: `/var/log/mail.log`

**Backend Logs:**
```bash
# Check PHP error logs
tail -f /var/log/php-errors.log

# Or check Apache/Nginx error logs
tail -f /var/log/apache2/error.log
tail -f /var/log/nginx/error.log
```

### Deep Link Not Working

**iOS:**
1. Rebuild the app after adding deep linking config
2. Check if URL scheme is registered: `app.config.js` → `scheme: "greenfield"`
3. Test with: `xcrun simctl openurl booted "greenfield://verify-email?token=xxx"`

**Android:**
1. Rebuild the app after adding intent filters
2. Check `app.config.js` → `android.intentFilters`
3. Test with: `adb shell am start -W -a android.intent.action.VIEW -d "greenfield://verify-email?token=xxx" com.zunnoon.greenfield`

### User Can't Login

1. Check if email is verified:
```sql
SELECT id, email, email_verified FROM users WHERE email = 'user@example.com';
```

2. Manually verify email for testing:
```sql
UPDATE users SET email_verified = 1 WHERE email = 'user@example.com';
```

3. Generate new verification token:
```sql
UPDATE users
SET email_verification_token = 'new-token-here',
    email_verification_expires_at = DATE_ADD(NOW(), INTERVAL 24 HOUR)
WHERE email = 'user@example.com';
```

## Database Queries

### Check Verification Status
```sql
SELECT id, name, email, email_verified, email_verification_expires_at
FROM users
WHERE email = 'user@example.com';
```

### List Unverified Users
```sql
SELECT id, name, email, created_at
FROM users
WHERE email_verified = 0
ORDER BY created_at DESC;
```

### Find Expired Tokens
```sql
SELECT id, email, email_verification_expires_at
FROM users
WHERE email_verified = 0
AND email_verification_expires_at < NOW();
```

### Clean Up Expired Tokens
```sql
UPDATE users
SET email_verification_token = NULL,
    email_verification_expires_at = NULL
WHERE email_verified = 0
AND email_verification_expires_at < NOW();
```

## Production Deployment

### 1. Upload Backend Files

Upload these files to your cPanel/production server:

**New files:**
- `backend/helpers/email.php` (updated with sendEmailVerification)
- `backend/api/verify-email.php`
- `backend/migrations/add_email_verification.sql`

**Modified files:**
- `backend/api/register.php`
- `backend/api/login.php`

### 2. Run Database Migration

Connect to your production database and run:
```bash
mysql -u username -p database_name < backend/migrations/add_email_verification.sql
```

Or via phpMyAdmin:
1. Open phpMyAdmin
2. Select your database
3. Go to SQL tab
4. Paste contents of `add_email_verification.sql`
5. Click "Go"

### 3. Configure Email Sending

For production, consider using a professional email service:

**Option 1: cPanel Email (Default)**
- cPanel has email configured by default
- PHP `mail()` function works automatically
- Emails sent from your domain

**Option 2: SMTP Service (Recommended)**

Use SendGrid, Mailgun, or AWS SES for better deliverability. See `PASSWORD_RESET_SETUP.md` for SMTP configuration examples.

### 4. Update Frontend

1. Rebuild the mobile app with updated screens
2. Deploy new version to app stores or TestFlight/Play Store Beta

### 5. Test Production Flow

1. Register with a real email
2. Verify you receive the email
3. Click verification link
4. Confirm email is verified
5. Login successfully

## Security Best Practices

1. ✅ Tokens are cryptographically random (64 hex characters)
2. ✅ Tokens expire after 24 hours
3. ✅ Tokens are deleted after verification
4. ✅ Users cannot login without verification
5. ✅ Email ownership verification
6. ✅ HTTPS for all API calls
7. ✅ No sensitive data in emails

## Future Enhancements

1. **Resend Verification Email:** Add button to resend verification email
2. **Email Change:** Add feature to change email with re-verification
3. **Rate Limiting:** Limit verification attempts per IP/user
4. **Email Templates:** Use a template engine for better email design
5. **SMS Verification:** Add SMS-based verification as alternative
6. **Audit Logging:** Log all verification attempts
7. **Welcome Bonus:** Offer discount/bonus after email verification
8. **Reminder Emails:** Send reminder if email not verified after 24h

## API Endpoints

### Register User
```
POST /api/register.php
```

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "03001234567"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Registration successful! Please check your email to verify your account.",
  "data": {
    "user": {
      "id": 123,
      "name": "John Doe",
      "email": "john@example.com",
      "email_verified": false
    },
    "verification_token": "abc123...",
    "email_sent": true
  }
}
```

### Verify Email
```
POST /api/verify-email.php
GET /api/verify-email.php?token=xxx
```

**Request:**
```json
{
  "token": "verification-token-here"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Email verified successfully! You can now login to your account.",
  "data": {
    "user": {
      "id": 123,
      "name": "John Doe",
      "email": "john@example.com",
      "email_verified": true
    }
  }
}
```

### Login (After Verification)
```
POST /api/login.php
```

**Request:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (Success - Email Verified):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 123,
      "name": "John Doe",
      "email": "john@example.com",
      "email_verified": true
    }
  }
}
```

**Response (Error - Email Not Verified):**
```json
{
  "success": false,
  "message": "Please verify your email address before logging in. Check your inbox for the verification email.",
  "error": true
}
```

## Support

For issues or questions, contact the development team.
