<?php
/**
 * Database Helper
 * Provides secure database operations with prepared statements
 */

/**
 * Execute a prepared SELECT query
 * @param mysqli $con Database connection
 * @param string $query SQL query with placeholders
 * @param string $types Parameter types (s=string, i=integer, d=double, b=blob)
 * @param array $params Parameters to bind
 * @return mysqli_result|false
 */
function dbSelect($con, $query, $types = '', $params = []) {
    if (empty($params)) {
        return $con->query($query);
    }

    $stmt = $con->prepare($query);
    if (!$stmt) {
        error_log("MySQL prepare error: " . $con->error);
        return false;
    }

    if (!empty($types) && !empty($params)) {
        $stmt->bind_param($types, ...$params);
    }

    if (!$stmt->execute()) {
        error_log("MySQL execute error: " . $stmt->error);
        $stmt->close();
        return false;
    }

    $result = $stmt->get_result();
    $stmt->close();
    return $result;
}

/**
 * Execute a prepared INSERT/UPDATE/DELETE query
 * @param mysqli $con Database connection
 * @param string $query SQL query with placeholders
 * @param string $types Parameter types
 * @param array $params Parameters to bind
 * @return array ['success' => bool, 'insert_id' => int, 'affected_rows' => int, 'error' => string]
 */
function dbExecute($con, $query, $types = '', $params = []) {
    $stmt = $con->prepare($query);
    if (!$stmt) {
        error_log("MySQL prepare error: " . $con->error);
        return ['success' => false, 'error' => $con->error, 'insert_id' => 0, 'affected_rows' => 0];
    }

    if (!empty($types) && !empty($params)) {
        $stmt->bind_param($types, ...$params);
    }

    $success = $stmt->execute();
    $insertId = $con->insert_id;
    $affectedRows = $stmt->affected_rows;
    $error = $stmt->error;

    $stmt->close();

    return [
        'success' => $success,
        'insert_id' => $insertId,
        'affected_rows' => $affectedRows,
        'error' => $error
    ];
}

/**
 * Fetch a single row
 * @param mysqli $con
 * @param string $query
 * @param string $types
 * @param array $params
 * @return array|null
 */
function dbFetchOne($con, $query, $types = '', $params = []) {
    $result = dbSelect($con, $query, $types, $params);
    if ($result && $result->num_rows > 0) {
        return $result->fetch_assoc();
    }
    return null;
}

/**
 * Fetch all rows
 * @param mysqli $con
 * @param string $query
 * @param string $types
 * @param array $params
 * @return array
 */
function dbFetchAll($con, $query, $types = '', $params = []) {
    $result = dbSelect($con, $query, $types, $params);
    $rows = [];

    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $rows[] = $row;
        }
    }

    return $rows;
}

/**
 * Check if record exists
 * @param mysqli $con
 * @param string $table
 * @param string $column
 * @param mixed $value
 * @return bool
 */
function dbExists($con, $table, $column, $value) {
    $query = "SELECT 1 FROM `{$table}` WHERE `{$column}` = ? LIMIT 1";
    $result = dbSelect($con, $query, 's', [$value]);
    return $result && $result->num_rows > 0;
}
