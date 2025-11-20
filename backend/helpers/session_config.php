<?php
/**
 * Session Configuration for React Native
 * Handles session management that works with mobile apps
 */

// Suppress deprecation warnings
error_reporting(E_ALL & ~E_DEPRECATED);

// Start session with custom configuration
if (session_status() === PHP_SESSION_NONE) {
    // Simple session config that works with React Native
    ini_set('session.use_cookies', 1);
    ini_set('session.cookie_httponly', 1);
    ini_set('session.cookie_lifetime', 86400); // 24 hours

    session_start();
}

// Handle session ID from headers (for React Native)
if (!isset($_SESSION['initialized'])) {
    // Check if session ID is passed in header
    $sessionId = $_SERVER['HTTP_X_SESSION_ID'] ?? null;

    if ($sessionId) {
        session_id($sessionId);
        session_start();
    }

    $_SESSION['initialized'] = true;
}

// Return current session ID for client to store
function getSessionId() {
    return session_id();
}

// Set CORS headers for React Native
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Session-ID, Authorization');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Expose-Headers: X-Session-ID');

// Send session ID in response header
if (session_id()) {
    header('X-Session-ID: ' . session_id());
}
?>
