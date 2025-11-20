<?php require_once("includes/db_settings.php"); ?>
<?php 
ob_start();
$update_id = $_POST['id'];
$writerID = str_replace("'","`",$_POST['writerID']);
$statuss = str_replace("'","`",$_POST['statuss']);

$query = "UPDATE cart 
SET writerID='{$writerID}'
where id='{$update_id}'";	
//echo $query . "<br/>";														
if (!mysqli_query($con,$query))
{
    die('Error: ' . mysqli_error($con));
}

$query_writer = "select * from members where id= $writerID ORDER by namee";
$result_writer = mysqli_query($con,$query_writer); 
$rec_found_writer = mysqli_num_rows($result_writer);
$row_writer = mysqli_fetch_array($result_writer);
$email=$row_writer['username'];
$first_name=$row_writer['namee'];

$to = $email. ", sales@hireresearcher.co.uk"; 
$subject = "Order Assigned | Paper Writer"; 
$from_email="orders@hireresearcher.co.uk";

$messageBody="";


$messageBody.='
<table width="100%" border="0" cellspacing="0" cellpadding="0" style="border:#efeeee solid 1px; padding:10px; font-family:Arial, Helvetica, sans-serif;">
<tr>
<td align="center" valign="top" style="background-color:#FFF"><img src="http://www.hireresearcher.co.uk/assets/img/headerlogo.png" width="263" height="111"/></td>
</tr>
<tr>
<td align="left" valign="top">
<table width="100%" border="0" cellspacing="0" cellpadding="0">
<tr>
<td align="left" valign="top"><h2 style="font-size:20px; font-weight:normal; padding:10px 0; font-family:Arial, Helvetica, sans-serif; border-bottom:#efeeee solid 1px;">Dear '.$first_name.', </h2></td>
</tr>
<tr>
<td>&nbsp;</td>
</tr>
<tr>
<td align="left" valign="top"><span style="font-size:14px; font-weight:bold; padding:10px 0; font-family:Arial, Helvetica, sans-serif; ">You have been assigned a new order at Paper Writer.</span></td>
</tr>
<tr>
<td>&nbsp;</td>
</tr>
<tr>
<td align="left" valign="top">
<p style="font-size:14px; font-weight:normal; padding:10px 0; font-family:Arial, Helvetica, sans-serif; border-bottom:#efeeee solid 1px; line-height:22px">
You are assigned a new order. Please make sure to complete it on provided date.<br></p>

<p style="font-size:14px; font-weight:normal; padding:10px 0; font-family:Arial, Helvetica, sans-serif; border-bottom:#efeeee solid 1px; line-height:22px">
Thank you for working with us.</p>

<p style="font-size:14px; font-weight:bold; padding:10px 0; font-family:Arial, Helvetica, sans-serif; border-bottom:#efeeee solid 1px; line-height:22px">
With Best Regards,<br>
Hire Researcher Team,<br>
<a href="http://www.hireresearcher.co.uk">http://www.hireresearcher.co.uk</a><br>
</p>

</td>
</tr>
</table>';

$headers = 'MIME-Version: 1.0' . "\r\n";
$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
$headers .= "from: ".$from_email."\r\n";
$headers .= "Content-type: text/html\r\n"; 

$sent = mail($to, $subject, $messageBody, $headers) ; 
//echo "<h2> 1 record updated successfully! </h2>";
header("Location:orders.php?statuss=$statuss");
?>