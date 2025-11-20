<?php
include("chkLogin.php");
include("includes/db_settings.php");
$m_title="Company Name CMS";

$id=$_POST['id'];
$role=$_POST['role'];
$shopID=$_POST['shopID'];
$browse_file_name1 = $_FILES["file4"]["name"];
$temp1 = $_FILES["file4"]["tmp_name"];
$error1 = $_FILES["file4"]["error"];


$browse_file_name2 = $_FILES["file2"]["name"];
$temp2 = $_FILES["file2"]["tmp_name"];
$error2 = $_FILES["file2"]["error"];


$browse_file_name3 = $_FILES["file3"]["name"];
$temp3 = $_FILES["file3"]["tmp_name"];
$error3 = $_FILES["file3"]["error"];

	move_uploaded_file($temp1,"upload/order/$shopID/" . $browse_file_name1);
	move_uploaded_file($temp2,"upload/order/$shopID/" . $browse_file_name2);
	move_uploaded_file($temp3,"upload/order/$shopID/" . $browse_file_name3);
	
	$message = str_replace("'","`",$_POST['message']);
	$datee=date("Y-m-d H:i:s");
	$amount = str_replace("'","`",$_POST['amount']);
	

	$ins_query_img = "insert into 												
				dashboard(email, message, datee, file1, file2, file3, pid, status, role, amount)
				values('admin','$message','$datee', '$browse_file_name1', '$browse_file_name2', '$browse_file_name3', '$id', '0','$role', '$amount')";
			if (!mysqli_query($con,$ins_query_img))
				  {
				  die('Error: ' . mysqli_error($con));
			}	
if ($role=="user"){			
$query3 = "select * from cart where id=$id";
$result3 = mysqli_query($query3); 
$row3 = mysqli_fetch_array($result3);

$query33 = "select * from profile where email2='".$row3['email']."'";
$result33 = mysqli_query($query33); 
$row33 = mysqli_fetch_array($result33);
	
$first_name=$row33['namee'];
$last_name=$row33['last_name'];
			
$to = $row3['email']; 
$subject = "New Message against your order PW - ". $id; 
$from_email="noreply@paperwriter.co.uk";



$messageBody="";

$messageBody.='
<table width="100%" border="0" cellspacing="0" cellpadding="0" style="border:#efeeee solid 1px; padding:10px; font-family:Arial, Helvetica, sans-serif;">
  <tr>
    <td align="center" valign="top" style="background-color:#FFF"><img src="http://www.paperwriter.co.uk/assets/img/headerlogo.png" width="263" height="111" /></td>
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
    <td align="left" valign="top">
	<p style="font-size:14px; font-weight:normal; padding:10px 0; font-family:Arial, Helvetica, sans-serif; border-bottom:#efeeee solid 1px; line-height:22px">
A new message has been posted by administrator against your order. Please login to view message under dashboard. New Message is, <br> '.$message.'</p>

<p style="font-size:14px; font-weight:normal; padding:10px 0; font-family:Arial, Helvetica, sans-serif; border-bottom:#efeeee solid 1px; line-height:22px">
Please knock us our live chat customer support 24/7 or email us at <a href="mailto:care@paperwriter.co.uk">care@paperwriter.co.uk</a></p>

<p style="font-size:14px; font-weight:normal; padding:10px 0; font-family:Arial, Helvetica, sans-serif; border-bottom:#efeeee solid 1px; line-height:22px">
If you think that this email has been sent to you because of error, please contact us immediately.</p>

<p style="font-size:14px; font-weight:bold; padding:10px 0; font-family:Arial, Helvetica, sans-serif; border-bottom:#efeeee solid 1px; line-height:22px">
With Best Regards,<br>
Paper Writer Team,<br>
<a href="http://www.paperwriter.co.uk">http://www.paperwriter.co.uk</a><br>
</p>

</td>
</tr>
</table>';

$headers = 'MIME-Version: 1.0' . "\r\n";
$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
$headers .= "from: ".$from_email."\r\n";
$headers .= "Content-type: text/html\r\n"; 

$sent = mail($to, $subject, $messageBody, $headers) ; 	
}			
	header("Location:dashboard.php?id=$id");
?>
