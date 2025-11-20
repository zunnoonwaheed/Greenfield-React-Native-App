<?php
/**
 * Login Endpoint
 * Authenticates user and creates session
 * Method: POST
 * Returns: JSON
 */

require_once("helpers/session_config.php");
require_once("admin/includes/db_settings.php");
require_once("helpers/response.php");
require_once("helpers/auth.php");
require_once("helpers/database.php");
require_once("helpers/logger.php");

header('Content-Type: application/json');

$startTime = startTimer();
$endpoint = '/login.php';

logRequest($endpoint, $_SERVER['REQUEST_METHOD'], ['email' => $_POST['email'] ?? '', 'password' => '***']);

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonError('Method not allowed', 405);
}

// Get and validate input (support both login_email and email)
$email = trim($_POST['login_email'] ?? $_POST['email'] ?? '');
$password = $_POST['login_password'] ?? $_POST['password'] ?? '';

// Validate required fields
if (empty($email) || empty($password)) {
    jsonError('Email and password are required', 422);
}

// Validate email format
if (!validateEmail($email)) {
    jsonError('Invalid email format', 422);
}

// Fetch user
$user = dbFetchOne($con, "SELECT id, name, email, phone, address, password FROM users WHERE email = ? LIMIT 1", 's', [$email]);

// Check if user exists
if (!$user) {
    jsonError('No account found with this email. Please sign up first.', 404);
}

// Verify password
if (!verifyPassword($password, $user['password'])) {
    jsonError('Invalid password. Please try again.', 401);
}

// Login successful - Set session
setUserSession($user);

logInfo("Login successful for user ID: {$user['id']}, Session ID: " . session_id());
logResponse($endpoint, true, null, "Login successful");
endTimer($startTime, $endpoint);

jsonSuccess([
    'user' => [
        'id' => $user['id'],
        'name' => $user['name'],
        'email' => $user['email'],
        'phone' => $user['phone'],
        'address' => $user['address']
    ],
    'session_id' => session_id()  // Return session ID for client
], 'Login successful');
?>
