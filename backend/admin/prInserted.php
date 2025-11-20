<?php
include("includes/db_settings.php");
require_once("includes/functions.php");
$page=$_POST['page'];
$username = str_replace("'","`",$_POST['username']);
$pwd = str_replace("'","`",$_POST['pwd']);
$namee = str_replace("'","`",$_POST['namee']);
$writer_asign = str_replace("'","`",$_POST['writer_asign']);
$role = str_replace("'","`",$_POST['role']);
$ins_query_img = "insert into members												
(namee, username, password, writer_asign, role)
values('{$namee}', '{$username}', '".addslashes(mysqli_real_escape_string(md5($pwd)))."', '{$writer_asign}', '{$role}')";
if (!mysqli_query($con,$ins_query_img))
{
    die('Error: ' . mysqli_error($con));
}
if($page=='subadmin'){
    $last_id = mysqli_insert_id($con);
    echo $last_id;
    foreach ($_POST['access'] as $id)   
    {
        $query = "insert into access (`sid`,`mid`) values('$last_id','$id')";//selected status
        mysqli_query($con,$query);
    }
}

header("Location:".$page.".php");
?>
