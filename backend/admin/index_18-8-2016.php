<?php 
session_start();
if(isset($_SESSION['writer_asign']) == 'admin')
{
    header("location: orders.php?statuss=Current");
}
else
{
    header("location: login.php");
}
?>