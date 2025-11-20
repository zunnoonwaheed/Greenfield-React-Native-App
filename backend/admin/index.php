<?php 
session_start();
//print_r($_SESSION);

/*if ($_SESSION['role']=="subadmin"){
     header("Location:price.php");
 }*/

if(isset($_SESSION['role']) == 'admin')
{
 //echo "waqas";
 
    header("location:posts.php");
    return;
}
else
{
    //echo "ansari";
    header("location:login.php");
}
?>