<?php
/**
 * Google Login API Endpoint
 * Authenticates user via Google Sign-In
 * Method: POST
 * Returns: JSON
 */

session_start();
require_once("../admin/includes/db_settings.php");
require_once("../helpers/response.php");
require_once("../helpers/auth.php");
require_once("../helpers/database.php");
require_once("../helpers/logger.php");

header('Content-Type: application/json');

$startTime = startTimer();
$endpoint = '/api/google-login.php';

// Log incoming request
logRequest($endpoint, $_SERVER['REQUEST_METHOD'], [
    'email' => $_POST['email'] ?? '',
    'name' => $_POST['name'] ?? ''
]);

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    logError($endpoint, 'Method not allowed');
    jsonError('Method not allowed', 405);
}

// Get and validate input
$idToken = trim($_POST['id_token'] ?? '');
$email = trim($_POST['email'] ?? '');
$name = trim($_POST['name'] ?? '');
$googleId = trim($_POST['google_id'] ?? '');
$photo = trim($_POST['photo'] ?? '');

// Validate required fields
if (empty($email) || empty($name) || empty($googleId)) {
    logError($endpoint, 'Missing required fields');
    jsonError('Email, name, and Google ID are required', 422);
}

// Validate email format
if (!validateEmail($email)) {
    logError($endpoint, 'Invalid email format');
    jsonError('Invalid email format', 422);
}

logInfo("Google login attempt for email: $email");

// Check if user exists with this email
$user = dbFetchOne($con, "SELECT id, name, email, phone, address, password, google_id, email_verified FROM users WHERE email = ? LIMIT 1", 's', [$email]);

if ($user) {
    // User exists - update Google ID if not set
    if (empty($user['google_id'])) {
        $updateResult = dbExecute($con, "UPDATE users SET google_id = ?, email_verified = 1 WHERE id = ?", 'si', [$googleId, $user['id']]);

        if (!$updateResult) {
            logError($endpoint, 'Failed to update Google ID for user: ' . $user['id']);
        } else {
            logInfo("Updated Google ID for existing user: {$user['id']}");
        }
    }

    // Set email as verified since Google verified it
    if ($user['email_verified'] != 1) {
        dbExecute($con, "UPDATE users SET email_verified = 1 WHERE id = ?", 'i', [$user['id']]);
    }

    // Set session
    setUserSession($user);

    logInfo("Google login successful for existing user ID: {$user['id']}");
    logResponse($endpoint, true, null, "Google login successful for {$user['email']}");
    endTimer($startTime, $endpoint);

    jsonSuccess([
        'user' => [
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'phone' => $user['phone'],
            'address' => $user['address'],
            'email_verified' => true
        ]
    ], 'Login successful');

} else {
    // User doesn't exist - create new account
    logInfo("Creating new user account for Google login: $email");

    // Insert new user (no password needed for Google accounts)
    $insertQuery = "INSERT INTO users (name, email, phone, address, password, google_id, email_verified, created_at)
                    VALUES (?, ?, '', '', '', ?, 1, NOW())";

    $insertResult = dbExecute($con, $insertQuery, 'sss', [$name, $email, $googleId]);

    if (!$insertResult) {
        logError($endpoint, 'Failed to create user account');
        jsonError('Failed to create account. Please try again.', 500);
    }

    // Get the newly created user
    $newUserId = $con->insert_id;
    $newUser = dbFetchOne($con, "SELECT id, name, email, phone, address, email_verified FROM users WHERE id = ? LIMIT 1", 'i', [$newUserId]);

    if (!$newUser) {
        logError($endpoint, 'Failed to fetch newly created user');
        jsonError('Account created but failed to login. Please try again.', 500);
    }

    // Set session
    setUserSession($newUser);

    logInfo("Google signup successful - new user ID: {$newUser['id']}");
    logResponse($endpoint, true, null, "Google signup successful for {$newUser['email']}");
    endTimer($startTime, $endpoint);

    jsonSuccess([
        'user' => [
            'id' => $newUser['id'],
            'name' => $newUser['name'],
            'email' => $newUser['email'],
            'phone' => $newUser['phone'],
            'address' => $newUser['address'],
            'email_verified' => true
        ],
        'is_new_user' => true
    ], 'Account created and logged in successfully');
}
?>
