<?php
/**
 * Register API Endpoint
 * Creates new user account
 * Method: POST
 * Returns: JSON
 */

session_start();
require_once("../admin/includes/db_settings.php");
require_once("../helpers/response.php");
require_once("../helpers/auth.php");
require_once("../helpers/database.php");
require_once("../helpers/logger.php");
require_once("../helpers/email.php");

header('Content-Type: application/json');

$startTime = startTimer();
$endpoint = '/api/register.php';

// Log incoming request
logRequest($endpoint, $_SERVER['REQUEST_METHOD'], [
    'email' => $_POST['email'] ?? '',
    'name' => $_POST['name'] ?? '',
    'phone' => $_POST['phone'] ?? '',
    'password' => '***'
]);

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    logError($endpoint, 'Method not allowed');
    jsonError('Method not allowed', 405);
}

// Get and validate input
$name     = trim($_POST['name'] ?? '');
$email    = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';
$phone    = trim($_POST['phone'] ?? '');

// Address fields (optional for simple registration)
$city          = trim($_POST['city'] ?? 'Islamabad');
$phase         = trim($_POST['phase'] ?? '');
$sector        = trim($_POST['sector'] ?? '');
$street        = trim($_POST['street'] ?? '');
$type          = trim($_POST['type'] ?? 'House');
$house_number  = trim($_POST['house_number'] ?? '');
$apartment     = trim($_POST['apartment_info'] ?? '');

// Validate required fields
$validation = validateRequired($_POST, ['name', 'email', 'password', 'phone']);
if (!$validation['valid']) {
    jsonError('Missing required fields: ' . implode(', ', $validation['missing']), 422);
}

// Validate email format
if (!validateEmail($email)) {
    jsonError('Invalid email format', 422);
}

// Validate password strength
$passwordValidation = validatePassword($password);
if (!$passwordValidation['valid']) {
    jsonError($passwordValidation['message'], 422);
}

// Check if email already exists
if (dbExists($con, 'users', 'email', $email)) {
    jsonError('Email already registered', 409);
}

// Build address string
$fullAddress = $city;
if ($phase) $fullAddress .= ", " . $phase;
if ($sector) $fullAddress .= ", " . $sector;
if ($street) $fullAddress .= ", Street: " . $street;
if ($type === "House" && $house_number) {
    $fullAddress .= ", House: " . $house_number;
}
if ($type === "Apartment" && $apartment) {
    $fullAddress .= ", Apartment: " . $apartment;
}

// Hash password
$hashedPassword = hashPassword($password);
$createdAt = date("Y-m-d H:i:s");

// Generate email verification token (valid for 24 hours)
$verificationToken = bin2hex(random_bytes(32));
$verificationExpires = date("Y-m-d H:i:s", strtotime('+24 hours'));

// Insert user with email verification fields
$query = "INSERT INTO users (name, email, password, phone, address, email_verified, email_verification_token, email_verification_expires_at, created_at)
          VALUES (?, ?, ?, ?, ?, 0, ?, ?, ?)";
$result = dbExecute($con, $query, 'ssssssss', [$name, $email, $hashedPassword, $phone, $fullAddress, $verificationToken, $verificationExpires, $createdAt]);

if ($result['success']) {
    $userId = $result['insert_id'];

    // Send email verification email
    $emailSent = sendEmailVerification($email, $name, $verificationToken);

    if ($emailSent) {
        logInfo("User registered successfully: ID $userId, Email: $email - Verification email sent");
        logResponse($endpoint, true, null, "Registration successful for $email");
        endTimer($startTime, $endpoint);

        jsonSuccess([
            'user' => [
                'id' => $userId,
                'name' => $name,
                'email' => $email,
                'phone' => $phone,
                'address' => $fullAddress,
                'email_verified' => false
            ],
            'verification_token' => $verificationToken, // For development/testing - remove in production
            'email_sent' => true
        ], 'Registration successful! Please check your email to verify your account.', 201);
    } else {
        // Email failed but user created
        error_log("⚠️ Failed to send verification email to $email, but user created with ID $userId");
        logInfo("User registered successfully: ID $userId, Email: $email - Email sending failed");
        logResponse($endpoint, true, null, "Registration successful for $email (email delivery failed)");
        endTimer($startTime, $endpoint);

        jsonSuccess([
            'user' => [
                'id' => $userId,
                'name' => $name,
                'email' => $email,
                'phone' => $phone,
                'address' => $fullAddress,
                'email_verified' => false
            ],
            'verification_token' => $verificationToken, // For development/testing
            'email_sent' => false,
            'note' => 'Email delivery may have failed. Token available for testing.'
        ], 'Registration successful! (Email verification may have failed - please contact support)', 201);
    }
} else {
    logError($endpoint, "Registration failed: " . $result['error']);
    logResponse($endpoint, false, null, 'Registration failed');
    endTimer($startTime, $endpoint);
    error_log("Registration error: " . $result['error']);
    jsonError('Registration failed. Please try again.', 500);
}
?>
