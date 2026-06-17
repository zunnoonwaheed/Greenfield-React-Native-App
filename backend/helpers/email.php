<?php
/**
 * Email Helper Functions
 * Handles sending emails for password reset and other notifications
 */

/**
 * Send email using PHP mail() function
 *
 * @param string $to Recipient email address
 * @param string $subject Email subject
 * @param string $message Email message (HTML supported)
 * @param string $from_email Sender email (optional)
 * @param string $from_name Sender name (optional)
 * @return bool True on success, false on failure
 */
function sendEmail($to, $subject, $message, $from_email = 'noreply@greenfield.com', $from_name = 'Greenfield SuperMarket') {
    // Email headers
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: $from_name <$from_email>" . "\r\n";
    $headers .= "Reply-To: $from_email" . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    // Send email
    $result = mail($to, $subject, $message, $headers);

    if ($result) {
        error_log("✅ Email sent successfully to: $to");
    } else {
        error_log("❌ Failed to send email to: $to");
    }

    return $result;
}

/**
 * Send password reset email with reset link
 *
 * @param string $email User's email address
 * @param string $name User's name
 * @param string $token Password reset token
 * @return bool True on success, false on failure
 */
function sendPasswordResetEmail($email, $name, $token) {
    $subject = "Reset Your Password - Greenfield SuperMarket";

    // Create reset link for mobile app (using custom deep link scheme)
    // Format: greenfield://reset-password?token=xxx
    $resetLink = "greenfield://reset-password?token=" . urlencode($token);

    // Also include a web link as backup (if you have a web version)
    // $webResetLink = "https://yourwebsite.com/reset-password?token=" . urlencode($token);

    // Email template
    $message = '
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5; padding: 20px;">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <!-- Header -->
                        <tr>
                            <td style="background-color: #0F7B5E; padding: 30px 20px; text-align: center;">
                                <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Greenfield SuperMarket</h1>
                            </td>
                        </tr>

                        <!-- Content -->
                        <tr>
                            <td style="padding: 40px 30px;">
                                <h2 style="color: #1A1A1A; margin: 0 0 20px 0; font-size: 24px;">Reset Your Password</h2>

                                <p style="color: #4E4E4E; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                    Hello ' . htmlspecialchars($name) . ',
                                </p>

                                <p style="color: #4E4E4E; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                    We received a request to reset your password for your Greenfield SuperMarket account. Click the button below to reset your password:
                                </p>

                                <!-- Reset Button -->
                                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0;">
                                    <tr>
                                        <td align="center">
                                            <a href="' . $resetLink . '" style="display: inline-block; padding: 15px 40px; background-color: #0F7B5E; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold;">Reset Password</a>
                                        </td>
                                    </tr>
                                </table>

                                <p style="color: #4E4E4E; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
                                    Or copy and paste this link into your browser:
                                </p>
                                <p style="color: #0F7B5E; font-size: 14px; line-height: 1.6; margin: 5px 0 20px 0; word-break: break-all;">
                                    ' . $resetLink . '
                                </p>

                                <div style="background-color: #FFF4E6; border-left: 4px solid #F2B23D; padding: 15px; margin: 20px 0;">
                                    <p style="color: #4E4E4E; font-size: 14px; line-height: 1.6; margin: 0;">
                                        <strong>Important:</strong> This link will expire in 1 hour for security reasons.
                                    </p>
                                </div>

                                <p style="color: #4E4E4E; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
                                    If you didn\'t request a password reset, please ignore this email or contact our support team if you have concerns.
                                </p>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="background-color: #f8f8f8; padding: 20px 30px; border-top: 1px solid #e0e0e0;">
                                <p style="color: #777777; font-size: 12px; line-height: 1.6; margin: 0; text-align: center;">
                                    © ' . date('Y') . ' Greenfield SuperMarket. All rights reserved.
                                </p>
                                <p style="color: #777777; font-size: 12px; line-height: 1.6; margin: 10px 0 0 0; text-align: center;">
                                    This is an automated email. Please do not reply to this message.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    ';

    return sendEmail($email, $subject, $message);
}

/**
 * Send email verification email with verification link
 *
 * @param string $email User's email address
 * @param string $name User's name
 * @param string $token Email verification token
 * @return bool True on success, false on failure
 */
function sendEmailVerification($email, $name, $token) {
    $subject = "Verify Your Email - Greenfield SuperMarket";

    // Create verification link for mobile app (using custom deep link scheme)
    // Format: greenfield://verify-email?token=xxx
    $verifyLink = "greenfield://verify-email?token=" . urlencode($token);

    // Email template
    $message = '
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5; padding: 20px;">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <!-- Header -->
                        <tr>
                            <td style="background-color: #0F7B5E; padding: 30px 20px; text-align: center;">
                                <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Greenfield SuperMarket</h1>
                            </td>
                        </tr>

                        <!-- Content -->
                        <tr>
                            <td style="padding: 40px 30px;">
                                <h2 style="color: #1A1A1A; margin: 0 0 20px 0; font-size: 24px;">Welcome to Greenfield!</h2>

                                <p style="color: #4E4E4E; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                    Hello ' . htmlspecialchars($name) . ',
                                </p>

                                <p style="color: #4E4E4E; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                    Thank you for registering with Greenfield SuperMarket! We\'re excited to have you on board.
                                </p>

                                <p style="color: #4E4E4E; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                    To complete your registration and start shopping, please verify your email address by clicking the button below:
                                </p>

                                <!-- Verify Button -->
                                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0;">
                                    <tr>
                                        <td align="center">
                                            <a href="' . $verifyLink . '" style="display: inline-block; padding: 15px 40px; background-color: #0F7B5E; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold;">Verify Email Address</a>
                                        </td>
                                    </tr>
                                </table>

                                <p style="color: #4E4E4E; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
                                    Or copy and paste this link into your browser:
                                </p>
                                <p style="color: #0F7B5E; font-size: 14px; line-height: 1.6; margin: 5px 0 20px 0; word-break: break-all;">
                                    ' . $verifyLink . '
                                </p>

                                <div style="background-color: #FFF4E6; border-left: 4px solid #F2B23D; padding: 15px; margin: 20px 0;">
                                    <p style="color: #4E4E4E; font-size: 14px; line-height: 1.6; margin: 0;">
                                        <strong>Important:</strong> This verification link will expire in 24 hours.
                                    </p>
                                </div>

                                <p style="color: #4E4E4E; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
                                    If you didn\'t create an account with Greenfield SuperMarket, please ignore this email.
                                </p>

                                <div style="border-top: 1px solid #e0e0e0; margin-top: 30px; padding-top: 20px;">
                                    <p style="color: #4E4E4E; font-size: 16px; line-height: 1.6; margin: 0 0 10px 0;">
                                        <strong>What\'s next?</strong>
                                    </p>
                                    <ul style="color: #4E4E4E; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
                                        <li>Browse thousands of products</li>
                                        <li>Get fast delivery to your doorstep</li>
                                        <li>Enjoy exclusive deals and offers</li>
                                        <li>Track your orders in real-time</li>
                                    </ul>
                                </div>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="background-color: #f8f8f8; padding: 20px 30px; border-top: 1px solid #e0e0e0;">
                                <p style="color: #777777; font-size: 12px; line-height: 1.6; margin: 0; text-align: center;">
                                    © ' . date('Y') . ' Greenfield SuperMarket. All rights reserved.
                                </p>
                                <p style="color: #777777; font-size: 12px; line-height: 1.6; margin: 10px 0 0 0; text-align: center;">
                                    This is an automated email. Please do not reply to this message.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    ';

    return sendEmail($email, $subject, $message);
}
