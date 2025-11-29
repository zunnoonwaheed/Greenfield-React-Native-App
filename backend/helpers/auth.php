<?php
/**
 * Authentication Middleware
 * Provides secure authentication checks for API endpoints
 */

/**
 * Check if user is authenticated
 * @return bool
 */
function isAuthenticated() {
    return isset($_SESSION['user_id']) && !empty($_SESSION['user_id']);
}

/**
 * Require authentication - Send JSON error and exit if not authenticated
 * @return void
 */
function requireAuth() {
    if (!isAuthenticated()) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'error' => 'Unauthorized',
            'message' => 'Please login to access this resource'
        ]);
        exit;
    }
}

/**
 * Get current user ID
 * @return int|null
 */
function getCurrentUserId() {
    return $_SESSION['user_id'] ?? null;
}

/**
 * Get current user data
 * @return array|null
 */
function getCurrentUser() {
    if (!isAuthenticated()) {
        return null;
    }

    return [
        'id' => $_SESSION['user_id'] ?? null,
        'name' => $_SESSION['user_name'] ?? '',
        'email' => $_SESSION['user_email'] ?? '',
        'phone' => $_SESSION['user_phone'] ?? '',
        'address' => $_SESSION['user_address'] ?? ''
    ];
}

/**
 * Set user session data
 * @param array $user User data from database
 * @return void
 */
function setUserSession($user) {
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_name'] = $user['name'];
    $_SESSION['user_email'] = $user['email'];
    $_SESSION['user_phone'] = $user['phone'] ?? '';
    $_SESSION['user_address'] = $user['address'] ?? '';
}

/**
 * Clear user session and logout
 * @return void
 */
function clearUserSession() {
    $_SESSION = [];

    if (isset($_COOKIE[session_name()])) {
        setcookie(session_name(), '', time() - 3600, '/');
    }

    session_destroy();
}

/**
 * Validate password strength
 * @param string $password
 * @return array ['valid' => bool, 'message' => string]
 */
function validatePassword($password) {
    if (strlen($password) < 6) {
        return ['valid' => false, 'message' => 'Password must be at least 6 characters long'];
    }
    return ['valid' => true, 'message' => ''];
}

/**
 * Validate email format
 * @param string $email
 * @return bool
 */
function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

/**
 * Hash password securely
 * @param string $password
 * @return string
 */
function hashPassword($password) {
    return password_hash($password, PASSWORD_BCRYPT);
}

/**
 * Verify password against hash
 * @param string $password
 * @param string $hash
 * @return bool
 */
function verifyPassword($password, $hash) {
    return password_verify($password, $hash);
}

/**
 * Authenticate user from session or JWT token
 * Used by API endpoints that require authentication
 * @param mysqli $con Database connection
 * @return int|null User ID if authenticated, null otherwise
 */
function authenticateUser($con) {
    // Start session if not started
    if (session_status() === PHP_SESSION_NONE) {
        require_once __DIR__ . '/session_config.php';
    }

    // First check session
    if (isset($_SESSION['user_id']) && !empty($_SESSION['user_id'])) {
        return intval($_SESSION['user_id']);
    }

    // Check for Bearer token in Authorization header
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';

    if (preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
        $token = $matches[1];

        // Try to decode JWT token (simple base64 for now - in production use proper JWT library)
        try {
            $parts = explode('.', $token);
            if (count($parts) === 3) {
                $payload = json_decode(base64_decode(strtr($parts[1], '-_', '+/')), true);
                if ($payload && isset($payload['user_id'])) {
                    // Verify user exists in database
                    $stmt = $con->prepare("SELECT id FROM users WHERE id = ?");
                    $stmt->bind_param('i', $payload['user_id']);
                    $stmt->execute();
                    $result = $stmt->get_result();

                    if ($result && $result->num_rows > 0) {
                        return intval($payload['user_id']);
                    }
                }
            }
        } catch (Exception $e) {
            error_log("JWT decode error: " . $e->getMessage());
        }
    }

    // For development/demo purposes, allow user_id to be passed directly
    // REMOVE THIS IN PRODUCTION
    if (isset($_POST['user_id'])) {
        return intval($_POST['user_id']);
    }
    if (isset($_GET['user_id']) && is_numeric($_GET['user_id'])) {
        return intval($_GET['user_id']);
    }

    // Default to user ID 1 for development if no auth provided
    // REMOVE THIS IN PRODUCTION
    return 1;
}
