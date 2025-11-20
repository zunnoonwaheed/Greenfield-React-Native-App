<?php
include("chkLogin.php");
include("includes/db_settings.php");
//$m_title="Company Name CMS";
?>
<?php require_once("includes/functions.php"); ?>
<?php
$to = $_GET['email']. ", care@paperwriter.co.uk"; 
$subject = "Order at Paper Writer"; 
$from_email="care@paperwriter.co.uk";

$query_meta = "select * from profile where email2='".$_GET['email']."'";
$result_meta = mysqli_query($con,$query_meta); 
$row_meta = mysqli_fetch_array($result_meta);
$first_name=$row_meta['namee'];
$last_name=$row_meta['last_name'];
$pass=$row_meta['password'];
$email3=$row_meta['email2'];

$messageBody="";

$messageBody.='
<table width="100%" border="0" cellspacing="0" cellpadding="0" style="border:#efeeee solid 1px; padding:10px; font-family:Arial, Helvetica, sans-serif;">
  <tr>
    <td align="center" valign="top" style="background-color:#000"><img src="https://www.paperwriter.co.uk/images/logo.png" width="247" height="62"/></td>
  </tr>
  <tr>
    <td align="left" valign="top">
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
  <tr>
    <td align="left" valign="top"><h2 style="font-size:20px; font-weight:normal; padding:10px 0; font-family:Arial, Helvetica, sans-serif; border-bottom:#efeeee solid 1px;">Dear '.$first_name.' '.$last_name.', </h2></td>
    </tr>
	<tr>
    <td>&nbsp;</td>
    </tr>
  <tr>
    <td align="left" valign="top"><span style="font-size:14px; font-weight:bold; padding:10px 0; font-family:Arial, Helvetica, sans-serif; ">Thank you for your order at Paper Writer.</span></td>
    </tr>
	<tr>
    <td>&nbsp;</td>
    </tr>
	<tr>
    <td align="left" valign="top">
	<p style="font-size:14px; font-weight:normal; padding:10px 0; font-family:Arial, Helvetica, sans-serif; border-bottom:#efeeee solid 1px; line-height:22px">
We have received your order details; however, we have not received your payment. Kindly pay the amount due so that your order is processed timely. If you wish to cancel your order anytime, please revert back to this email. We believe in creating long-term relationships with our customers by delivering Quality & 100% plagiarism free work along with a Turnitin Report in order to ensure the originality. Moreover, there are no extra or hidden charges.<br></p>

<p style="font-size:14px; font-weight:normal; padding:10px 0; font-family:Arial, Helvetica, sans-serif; border-bottom:#efeeee solid 1px; line-height:22px">
To process your order, please follow the 4 steps below:</p>

<ul>
<li><strong>Step 1:</strong> Please log in to the web <a href="https://www.paperwriter.co.uk/login">www.paperwriter.co.uk/login</a> (If you are already logged in, please move to step 3 directly)</li><br>

<li><strong>Step 2:</strong> Enter your Email ID & Password and click <strong>"Submit"</strong></li><br>

<li style="margin-left:2em"><strong>Email:</strong> '.$email3.'</li><br>

<li style="margin-left:2em"><strong>Password:</strong> '.$pass.'</li><br>

<li><strong>Step 3:</strong> Once you are logged in, click the following link: <a href="https://www.paperwriter.co.uk/orderdetails">https://www.paperwriter.co.uk/orderdetails</a></li><br>

<li><strong>Step 4:</strong> Click <strong>"Pay Now"</strong> to process your payment.</li><br></ul>

<p>Your quick response will be highly appreciated.</p><br>

<p style="font-size:14px; font-weight:bold; padding:10px 0; font-family:Arial, Helvetica, sans-serif; border-bottom:#efeeee solid 1px; line-height:22px">
Best Regards,<br>
Team, Paper Writer,<br>
<a href="http://www.paperwriter.co.uk">http://www.paperWriter.co.uk</a><br>
</p>

</td>
</tr>
</table>';

$headers = 'MIME-Version: 1.0' . "\r\n";
$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
$headers .= "from: ".$from_email."\r\n";
$headers .= "Content-type: text/html\r\n"; 

$sent = mail($to, $subject, $messageBody, $headers) ; 
$statuss=$_GET['statuss'];
header("Location:orders.php?statuss=$statuss");
?>
