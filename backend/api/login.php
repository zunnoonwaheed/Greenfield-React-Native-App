<?php
/**
 * Login API Endpoint
 * Authenticates user and creates session
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
$endpoint = '/api/login.php';

// Log incoming request
logRequest($endpoint, $_SERVER['REQUEST_METHOD'], [
    'email' => $_POST['email'] ?? '',
    'password' => '***'
]);

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    logError($endpoint, 'Method not allowed');
    jsonError('Method not allowed', 405);
}

// Get and validate input
$email = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';

// Validate required fields
if (empty($email) || empty($password)) {
    logError($endpoint, 'Missing email or password');
    jsonError('Email and password are required', 422);
}

// Validate email format
if (!validateEmail($email)) {
    logError($endpoint, 'Invalid email format');
    jsonError('Invalid email format', 422);
}

logInfo("Attempting login for email: $email");

// Fetch user
$user = dbFetchOne($con, "SELECT id, name, email, phone, address, password FROM users WHERE email = ? LIMIT 1", 's', [$email]);

if ($user && verifyPassword($password, $user['password'])) {
    // Set session
    setUserSession($user);

    logInfo("Login successful for user ID: {$user['id']}");
    logResponse($endpoint, true, null, "Login successful for {$user['email']}");
    endTimer($startTime, $endpoint);

    jsonSuccess([
        'user' => [
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'phone' => $user['phone'],
            'address' => $user['address']
        ]
    ], 'Login successful');
} else {
    logError($endpoint, 'Invalid credentials for email: ' . $email);
    logResponse($endpoint, false, null, 'Invalid credentials');
    endTimer($startTime, $endpoint);
    jsonError('Invalid email or password', 401);
}
?>
