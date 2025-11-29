<?php
/**
 * JSON Response Helper
 * Provides consistent JSON responses across all API endpoints
 */

// Note: ob_start() should be called in each API endpoint file, not here
// to avoid double buffering issues

/**
 * Send JSON success response (alias: respondSuccess)
 * @param mixed $data Response data
 * @param int $httpCode HTTP status code
 * @return void
 */
function respondSuccess($data = null, $httpCode = 200) {
    // Clear any previous output if buffer exists
    while (ob_get_level() > 0) {
        ob_end_clean();
    }

    http_response_code($httpCode);
    header('Content-Type: application/json; charset=utf-8');

    $response = ['success' => true];

    if ($data !== null) {
        if (is_array($data)) {
            $response = array_merge($response, $data);
        } else {
            $response['data'] = $data;
        }
    }

    echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

/**
 * Send JSON error response (alias: respondError)
 * @param string $message Error message
 * @param int $httpCode HTTP status code
 * @return void
 */
function respondError($message, $httpCode = 400) {
    // Clear any previous output if buffer exists
    while (ob_get_level() > 0) {
        ob_end_clean();
    }

    http_response_code($httpCode);
    header('Content-Type: application/json; charset=utf-8');

    echo json_encode([
        'success' => false,
        'error' => $message
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

/**
 * Send JSON success response
 * @param mixed $data
 * @param string $message
 * @param int $httpCode
 * @return void
 */
function jsonSuccess($data = null, $message = 'Success', $httpCode = 200) {
    http_response_code($httpCode);
    header('Content-Type: application/json');

    $response = [
        'success' => true,
        'message' => $message
    ];

    if ($data !== null) {
        $response['data'] = $data;
    }

    echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

/**
 * Send JSON error response
 * @param string $message
 * @param int $httpCode
 * @param mixed $errors
 * @return void
 */
function jsonError($message, $httpCode = 400, $errors = null) {
    http_response_code($httpCode);
    header('Content-Type: application/json');

    $response = [
        'success' => false,
        'error' => $message
    ];

    if ($errors !== null) {
        $response['errors'] = $errors;
    }

    echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

/**
 * Validate required fields
 * @param array $data
 * @param array $requiredFields
 * @return array ['valid' => bool, 'missing' => array]
 */
function validateRequired($data, $requiredFields) {
    $missing = [];

    foreach ($requiredFields as $field) {
        if (!isset($data[$field]) || trim($data[$field]) === '') {
            $missing[] = $field;
        }
    }

    return [
        'valid' => empty($missing),
        'missing' => $missing
    ];
}

/**
 * Sanitize input string
 * @param string $input
 * @return string
 */
function sanitizeInput($input) {
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}

/**
 * Validate and sanitize POST data
 * @param array $fields
 * @return array
 */
function getPostData($fields) {
    $data = [];
    foreach ($fields as $field) {
        $data[$field] = sanitizeInput($_POST[$field] ?? '');
    }
    return $data;
}
