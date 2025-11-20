<?php
include("chkLogin.php");
include("includes/db_settings.php");
//$m_title="Company Name CMS";
?>
<?php require_once("includes/functions.php"); ?>
<?php session_start(); ?>
<?php
            $query_c = "select * from textpage where id=118";
            $result_c = mysqli_query($con,$query_c); 
            $rec_found_c = mysqli_num_rows($result_c);
            $row_c = mysqli_fetch_array($result_c);
            ?>	
<?php
$to = $_GET['email']. "";
$subject = $row_c['title']."";
$from_email="care@paperwriter.co.uk";

$query_meta = "select * from profile where email2='".$_GET['email']."'";
$result_meta = mysqli_query($con,$query_meta); 
$row_meta = mysqli_fetch_array($result_meta);
$first_name=$row_meta['namee'];
$last_name=$row_meta['last_name'];
$pass=$row_meta['password'];
$email3=$row_meta['email2'];


$messageBody="";

$messageBody =$row_c['short_desc']."";

$headers = 'MIME-Version: 1.0' . "\r\n";
$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
$headers .= "from: ".$from_email."\r\n";
$headers .= "Content-type: text/html\r\n"; 

$sent = mail($to, $subject, $messageBody, $headers) ; 
$statuss=$_GET['statuss'];
header("Location:clients.php");
?>
