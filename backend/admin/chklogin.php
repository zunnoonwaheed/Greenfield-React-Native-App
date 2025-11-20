<?php 
/*if(empty($con,$_SESSION[["userName"]])){
header("location: login.php");

} */?>


<?php
include("includes/session.php");
include("includes/db_settings.php");
@$UID=$_SESSION['userName'];
@$PWD=$_SESSION['pwd'];
if (($UID=="")&&($PWD=="")){
    header("Location:index.php?msg1=1");
    return;
}
@$websiteID=$_GET['websiteID'];
if ($websiteID!=""){
    $_SESSION['websiteID']=$websiteID;
}
if(!isset($_SESSION['websiteID'])){
    header("Location:main.php");
    return;
}
?>
