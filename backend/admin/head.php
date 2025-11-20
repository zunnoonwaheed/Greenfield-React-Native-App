<?php
include("includes/session.php");
include("includes/db_settings.php");
?>
<?php 
/*if(isset($_SESSION['writer_asign'], $_SESSION['userName'], $_SESSION['pwd'])){
    if($_SESSION['writer_asign']!= 'admin'){
        header("Location:login.php?msg1=1");
        return;
    }
}else{
    header("Location:login.php?msg1=1");
    return;
}*/
?>
<!DOCTYPE html>
<html>


<!-- Mirrored from webapplayers.com/inspinia_admin-v2.5/login.html by HTTrack Website Copier/3.x [XR&CO'2014], Thu, 26 May 2016 13:08:41 GMT -->
<head>

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Admin Panel</title>

    <link href="<? echo $domain; ?>css/bootstrap.min.css" rel="stylesheet">
    <link href="<? echo $domain; ?>font-awesome/css/font-awesome.css" rel="stylesheet">

 
    <link href="<? echo $domain; ?>css/style.css" rel="stylesheet">
    <link rel="shortcut icon" href="<? echo $domain;?>images/fav.png">
</head>

<?php

class htmlControl{
    function getHeaderSection($heading){
        return ' <div class="row wrapper border-bottom white-bg page-heading">
        <div class="col-lg-10">
        <h2>'.strtoupper($heading).'</h2>
        <ol class="breadcrumb">
        <li>
        <a href="index.php">Home</a>
        </li>
        <li class="active">
        <strong>'.strtoupper($heading).'</strong>
        </li>
        </ol>
        </div>
        <div class="col-lg-2">

        </div>
        </div>';
    }
}
//echo '<pre>';
//var_dump($_SESSION);
// echo '</pre>';
?>