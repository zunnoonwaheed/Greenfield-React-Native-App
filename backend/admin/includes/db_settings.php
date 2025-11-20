<?php
//$db_host = "localhost";
//$db_user = "root";
//$db_pass = "";
//$db_name = "paperwri_db";
$db_host = "localhost";
$db_user = "root";
$db_pass = "";
$db_name = "greenfieldsuperm_db_local";

$con = mysqli_connect($db_host, $db_user, $db_pass, $db_name);
if ($con->connect_error)
{
    die('Connect Error (' . mysqli_connect_errno() . ') '. mysqli_connect_error());
}
$domain="https://{$_SERVER['HTTP_HOST']}/admin/";