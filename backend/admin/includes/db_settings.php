<?php
// Database configuration - SHARED with web application
// Both mobile app and web use the same database
$db_host = "localhost";
$db_user = "root";
$db_pass = "";
$db_name = "greenfieldsuperm_db";  // Web database - shared across both apps

$con = mysqli_connect($db_host, $db_user, $db_pass, $db_name);
if ($con->connect_error)
{
    die('Connect Error (' . mysqli_connect_errno() . ') '. mysqli_connect_error());
}
$domain="https://{$_SERVER['HTTP_HOST']}/admin/";