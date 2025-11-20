<?php
/**
 * Logout Endpoint
 * Destroys user session and logs out
 * Method: GET/POST
 * Returns: JSON
 */

session_start();
require_once("helpers/response.php");
require_once("helpers/auth.php");

header('Content-Type: application/json');

// Clear session
clearUserSession();

jsonSuccess(null, 'Logged out successfully');