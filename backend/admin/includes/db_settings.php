<?php
/**
 * Database configuration - Production DB
 * Both mobile app and web use the same production database
 */

// cPanel Production DB credentials
$db_host = "localhost";                  // Usually 'localhost' in cPanel
$db_user = "greenfieldsuperm_user";     // Production DB user
$db_pass = "Samikhan123###";            // Production DB password
$db_name = "greenfieldsuperm_db";       // Production DB name

// Create connection
$con = mysqli_connect($db_host, $db_user, $db_pass, $db_name);
if ($con->connect_error)
{
    die('Connect Error (' . mysqli_connect_errno() . ') '. mysqli_connect_error());
}

// Admin domain
$domain = "https://{$_SERVER['HTTP_HOST']}/admin/";
?>
