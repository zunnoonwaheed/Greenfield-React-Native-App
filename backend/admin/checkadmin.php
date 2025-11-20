<?php
include("includes/db_settings.php"); 
include("includes/session.php");
ob_start(); 
$UID="";
$PWD="";

if(isset($_POST["lid"]))
    $UID=str_replace("'","`",$_POST["lid"]);



if(isset($_POST["pwd"]))
    $PWD=str_replace("'","`",$_POST["pwd"]);

$query3 = "SELECT * FROM members WHERE `username` = '".addslashes(mysqli_real_escape_string($con,$UID))."' AND `password` = '".addslashes(mysqli_real_escape_string($con,md5($PWD)))."' AND `role` <> 'writer'";    
//var_dump($query3);die;
$result3 = mysqli_query($con,$query3); 
$rec_found3 = mysqli_num_rows($result3);
$row3 = mysqli_fetch_array($result3);

if (isset($row3) != 0){

    $role=$row3['role'];
    $allow_upload=$row3['allow_upload'];
    $_SESSION['userName']=$UID;
    $_SESSION['pwd']=$PWD;
    $_SESSION['role']=$role;
    header("Location:index.php");
}
else
{
    header("Location:index.php?msg1=1");
}
?>