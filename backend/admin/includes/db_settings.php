<?php
/**
 * Database configuration - Local Development
 * Using local MySQL for development
 */

// Local MySQL credentials (Homebrew MySQL)
$db_host = "localhost";
$db_user = "root";                    // Default MySQL user
$db_pass = "";                        // Empty password for Homebrew MySQL
$db_name = "greenfieldsuperm_db_local";  // Local database

// Create connection
$con = mysqli_connect($db_host, $db_user, $db_pass, $db_name);
if ($con->connect_error)
{
    die('Connect Error (' . mysqli_connect_errno() . ') '. mysqli_connect_error());
}

// Admin domain
$domain = "https://{$_SERVER['HTTP_HOST']}/admin/";
?>
