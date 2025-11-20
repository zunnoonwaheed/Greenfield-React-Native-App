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

$query3 = "SELECT * FROM members WHERE `username` = '".addslashes(mysqli_real_escape_string($UID))."' AND `password` = '".addslashes(mysqli_real_escape_string(md5($PWD)))."'";	
//var_dump($query3); AND `role` <> 'writer' and writer_asign <> 'manager' and writer_asign <> 'writer'
$result3 = mysqli_query($con,$query3); 

if (mysqli_num_rows($result3)>0)
{
    $row3 = mysqli_fetch_array($result3);
    $role=$row3['role'];
    $allow_upload=$row3['allow_upload'];
    $_SESSION['id']=$row3['id'];
    $_SESSION['writer_asign']=$row3['writer_asign'];
    $_SESSION['userName']=$UID;
    // $_SESSION['pwd']=$PWD;
    $_SESSION['role']=$role;
    // print_r($_SESSION);die;

    /* if($_SESSION['writer_asign']=="admin")
    $redirectulr="admin/index.php";
    else if($_SESSION['writer_asign']=="Manager")
    $redirectulr="../manager/index.php";

    header("Location:$redirectulr");
    }*/
    if($_SESSION['writer_asign']=="admin")
        $redirectulr="../admin/index.php";
    else if($_SESSION['writer_asign']=="Manager")
        $redirectulr="../manager/index.php";
        header("Location:$redirectulr");
}
else
{
    header("Location:login.php?msg1=1");
}



?>