<?php
/**
 * API Logger Helper
 * Provides consistent logging across all API endpoints
 * Logs are written to error_log and echoed to PHP output
 */

/**
 * Log API request
 * @param string $endpoint - Endpoint name
 * @param string $method - HTTP method
 * @param array $params - Request parameters (sensitive data will be masked)
 * @return void
 */
function logRequest($endpoint, $method = 'UNKNOWN', $params = []) {
    $timestamp = date('Y-m-d H:i:s');
    $masked_params = maskSensitiveData($params);

    $log = "[$timestamp] [REQUEST] $method $endpoint";
    if (!empty($masked_params)) {
        $log .= " | Params: " . json_encode($masked_params);
    }

    error_log($log);
    error_log("\n" . str_repeat('=', 80));
    error_log("🔵 API REQUEST");
    error_log("Endpoint: $endpoint");
    error_log("Method: $method");
    error_log("Time: $timestamp");
    if (!empty($masked_params)) {
        error_log("Params: " . json_encode($masked_params, JSON_PRETTY_PRINT));
    }
    error_log(str_repeat('=', 80) . "\n");
}

/**
 * Log API response
 * @param string $endpoint - Endpoint name
 * @param bool $success - Whether request was successful
 * @param mixed $data - Response data
 * @param string $message - Response message
 * @return void
 */
function logResponse($endpoint, $success, $data = null, $message = '') {
    $timestamp = date('Y-m-d H:i:s');
    $status = $success ? 'SUCCESS' : 'ERROR';
    $icon = $success ? '✅' : '❌';

    $log = "[$timestamp] [RESPONSE] $status $endpoint | $message";
    error_log($log);
    error_log("\n$icon API RESPONSE");
    error_log("Endpoint: $endpoint");
    error_log("Status: $status");
    error_log("Message: $message");
    error_log("Time: $timestamp");
    error_log(str_repeat('=', 80) . "\n");
}

/**
 * Log database query
 * @param string $query - SQL query (will be truncated if too long)
 * @param bool $success - Whether query succeeded
 * @param int $affectedRows - Number of affected rows
 * @return void
 */
function logQuery($query, $success, $affectedRows = 0) {
    $timestamp = date('Y-m-d H:i:s');
    $status = $success ? 'SUCCESS' : 'FAILED';
    $icon = $success ? '✓' : '✗';

    // Truncate long queries
    $displayQuery = strlen($query) > 100 ? substr($query, 0, 100) . '...' : $query;

    $log = "[$timestamp] [DB] $status Query: $displayQuery | Affected: $affectedRows";
    error_log($log);
    error_log("  $icon Database: $displayQuery | Rows: $affectedRows");
}

/**
 * Mask sensitive data in parameters
 * @param array $params - Parameters to mask
 * @return array - Masked parameters
 */
function maskSensitiveData($params) {
    $sensitive_fields = ['password', 'new_password', 'old_password', 'token', 'reset_token'];
    $masked = $params;

    foreach ($sensitive_fields as $field) {
        if (isset($masked[$field])) {
            $masked[$field] = '***MASKED***';
        }
    }

    return $masked;
}

/**
 * Log error
 * @param string $endpoint - Endpoint name
 * @param string $error - Error message
 * @param Exception $exception - Optional exception object
 * @return void
 */
function logError($endpoint, $error, $exception = null) {
    $timestamp = date('Y-m-d H:i:s');

    $log = "[$timestamp] [ERROR] $endpoint | $error";
    if ($exception) {
        $log .= " | " . $exception->getMessage();
    }
    error_log($log);
    error_log("\n❌ ERROR in $endpoint");
    error_log("Message: $error");
    if ($exception) {
        error_log("Exception: " . $exception->getMessage());
        error_log("File: " . $exception->getFile() . ":" . $exception->getLine());
    }
    error_log(str_repeat('=', 80) . "\n");
}

/**
 * Log info message
 * @param string $message - Info message
 * @return void
 */
function logInfo($message) {
    $timestamp = date('Y-m-d H:i:s');
    $log = "[$timestamp] [INFO] $message";
    error_log($log);
    error_log("ℹ️  $message");
}

/**
 * Start endpoint execution timer
 * @return float - Start time
 */
function startTimer() {
    return microtime(true);
}

/**
 * End endpoint execution timer and log duration
 * @param float $startTime - Start time from startTimer()
 * @param string $endpoint - Endpoint name
 * @return void
 */
function endTimer($startTime, $endpoint) {
    $duration = round((microtime(true) - $startTime) * 1000, 2);
    error_log("⏱️  Execution time: {$duration}ms");
    error_log("[$endpoint] Execution time: {$duration}ms");
}
