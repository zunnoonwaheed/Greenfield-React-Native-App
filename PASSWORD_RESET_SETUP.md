# Password Reset Setup Guide

## Overview

The password reset functionality has been implemented with email delivery and deep linking support. Users can request a password reset link via email, click the link to open the app, and reset their password.

## How It Works

### 1. User Flow

1. User taps "Forgot Password?" on the login screen
2. User enters their email address
3. User receives an email with a password reset link
4. User clicks the link in the email
5. App opens to the Reset Password screen
6. User enters new password and confirms
7. Password is reset successfully
8. User is redirected to login with new password

### 2. Technical Implementation

#### Backend (PHP)

**Files Modified:**
- `/backend/api/forgot-password.php` - Generates token and sends email
- `/backend/api/reset-password.php` - Validates token and updates password
- `/backend/helpers/email.php` - NEW - Email sending functions

**Email Configuration:**
- Uses PHP's built-in `mail()` function
- Sender: `noreply@greenfield.com`
- Subject: "Reset Your Password - Greenfield SuperMarket"
- HTML email template with branded design
- Reset token expires in 1 hour

**Security Features:**
- Tokens are cryptographically secure (64 character hex)
- Tokens expire after 1 hour
- Old tokens are deleted when new ones are generated
- Used tokens are deleted after password reset
- Password validation (minimum 6 characters)

#### Frontend (React Native)

**Files Modified:**
- `/frontend/app.config.js` - Deep linking configuration
- `/frontend/App.tsx` - Navigation deep linking setup
- `/frontend/screens/ForgotPasswordScreen.tsx` - Email request UI
- `/frontend/screens/ResetPasswordScreen.tsx` - Password reset UI

**Deep Linking:**
- URL Scheme: `greenfield://reset-password?token=xxx`
- Also supports: `https://greenfieldsupermarket.com/reset-password?token=xxx`
- Automatically opens app when link is clicked
- Navigates to ResetPassword screen with token parameter

## Email Server Configuration

### For Development/Testing

The current implementation uses PHP's `mail()` function, which may not work on all development environments. For testing:

**Option 1: Use Development Token (Current)**
- Backend returns token in API response for testing
- Frontend shows "Test Reset (Dev)" button in success alert
- Click to directly navigate to reset screen

**Option 2: Configure Local Mail Server**

For Mac/Linux:
```bash
# Install and configure Postfix
sudo postfix start

# Test email sending
echo "Test email" | mail -s "Test Subject" your@email.com
```

For Windows:
- Install a local SMTP server like hMailServer or Papercut SMTP

### For Production

**Option 1: Use Server's Mail Function**
- Ensure your web server has mail sending configured
- Configure SPF and DKIM records for your domain
- Test with: `php -r "mail('test@example.com', 'Test', 'Test message');"`

**Option 2: Use SMTP Service (Recommended)**

Integrate a professional email service for better deliverability:

1. **SendGrid** (Recommended)
```php
// Install: composer require sendgrid/sendgrid
use SendGrid\Mail\Mail;

$email = new Mail();
$email->setFrom("noreply@greenfield.com", "Greenfield SuperMarket");
$email->setSubject("Reset Your Password");
$email->addTo($to);
$email->addContent("text/html", $message);

$sendgrid = new \SendGrid(getenv('SENDGRID_API_KEY'));
$response = $sendgrid->send($email);
```

2. **Mailgun**
```php
// Install: composer require mailgun/mailgun-php
$mgClient = Mailgun::create('your-api-key');
$domain = "greenfieldsupermarket.com";

$mgClient->messages()->send($domain, [
    'from'    => 'noreply@greenfield.com',
    'to'      => $to,
    'subject' => $subject,
    'html'    => $message
]);
```

3. **AWS SES**
```php
// Install: composer require aws/aws-sdk-php
use Aws\Ses\SesClient;

$client = SesClient::factory([
    'version' => 'latest',
    'region'  => 'us-east-1'
]);

$result = $client->sendEmail([
    'Source' => 'noreply@greenfield.com',
    'Destination' => ['ToAddresses' => [$to]],
    'Message' => [
        'Subject' => ['Data' => $subject],
        'Body' => ['Html' => ['Data' => $message]]
    ]
]);
```

## Testing the Flow

### Development Testing

1. **Test Email Generation:**
```bash
cd backend
php -r "
require_once('helpers/email.php');
sendPasswordResetEmail('test@example.com', 'Test User', 'test-token-123');
"
```

2. **Test Complete Flow:**
   - Run the app in development mode
   - Navigate to Forgot Password screen
   - Enter a test email (must exist in database)
   - Check backend logs for email sending status
   - Click "Test Reset (Dev)" button in alert
   - Enter new password
   - Confirm password reset
   - Login with new password

3. **Test Deep Link:**
```bash
# iOS Simulator
xcrun simctl openurl booted "greenfield://reset-password?token=test-token-123"

# Android Emulator
adb shell am start -W -a android.intent.action.VIEW -d "greenfield://reset-password?token=test-token-123" com.zunnoon.greenfield
```

### Production Testing

1. Use a real email address you can access
2. Request password reset
3. Check email inbox (and spam folder)
4. Click the link in the email
5. App should open to Reset Password screen
6. Complete password reset
7. Verify login with new password

## Troubleshooting

### Email Not Received

**Check:**
1. Email server is configured and running
2. Firewall allows SMTP traffic (port 25)
3. Check spam/junk folder
4. Verify sender domain has proper DNS records (SPF, DKIM, DMARC)
5. Check server mail logs: `/var/log/mail.log` or `/var/log/maillog`

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
3. Test with: `xcrun simctl openurl booted "greenfield://reset-password?token=xxx"`

**Android:**
1. Rebuild the app after adding intent filters
2. Check `app.config.js` → `android.intentFilters`
3. Test with: `adb shell am start -W -a android.intent.action.VIEW -d "greenfield://reset-password?token=xxx" com.zunnoon.greenfield`

### Token Expired

- Tokens expire after 1 hour for security
- User needs to request a new reset link
- Check `password_resets` table for expired tokens
- Clean up old tokens periodically

## Database Schema

The `password_resets` table:
```sql
CREATE TABLE password_resets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_token (token),
    INDEX idx_email (email),
    INDEX idx_expires (expires_at)
);
```

## Security Best Practices

1. ✅ Tokens are cryptographically random (64 hex characters)
2. ✅ Tokens expire after 1 hour
3. ✅ Tokens are single-use (deleted after reset)
4. ✅ Password strength validation
5. ✅ Rate limiting (should be added in production)
6. ✅ HTTPS for all API calls
7. ✅ No password sent via email
8. ✅ User verification via email ownership

## Future Enhancements

1. **Rate Limiting:** Limit reset requests per email/IP
2. **Email Templates:** Use a template engine for better email design
3. **SMS Option:** Add SMS-based password reset as alternative
4. **Two-Factor Auth:** Add 2FA for enhanced security
5. **Audit Logging:** Log all password reset attempts
6. **Notification:** Alert user when password is changed
7. **IP Tracking:** Record IP addresses of reset requests

## Support

For issues or questions, contact the development team.
