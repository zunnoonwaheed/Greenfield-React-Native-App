<?php
include("chkLogin.php");
include("includes/db_settings.php");
$m_title="Company Name CMS";
?>
<?php
$id=$_REQUEST['invno'];

$query = "select * from invoice where id=$id";
$result = mysqli_query($con,$query); 
$rec_found = mysqli_fetch_array($result);

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>Pro Writer Admin Panel</title>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
<!--<title>Altawash Admin Panel </title>-->
<link href="../stylesheets/public.css" rel="stylesheet" type="text/css" />
<link href="css/style.css" rel="stylesheet" type="text/css" />
</head>
<body>
	<!-- Main Table Start -->
	<table width="986" border="0" align="center" cellpadding="0" cellspacing="0">
	  <tr height="100">
	    <td><!-- Header Content Placement -->
	      <?php require_once("top.php");  ?></td>
      </tr>
	  <tr>
	    <td><table width="100%" border="0" cellspacing="0" cellpadding="0">
	      <tr>
	        <td height="8" colspan="2"></td>
          </tr>
	      <tr>
	        <td width="50%"><table width="90%" border="0" align="left" cellpadding="0" cellspacing="0">
	          <tr>
	            <td class="text4">To, </td>
              </tr>
	          <tr>
	            <td class="hrBlack" style="padding-left:20px;">M/S &nbsp; <?php echo $rec_found['namee'];?></td>
              </tr>
	          <tr>
	            <td height="8"></td>
              </tr>
	          <tr>
	            <td class="text2"><span class="text4">Email:</span> <?php echo $rec_found['email'];?></td>
              </tr>
	          <tr>
	            <td height="8"></td>
              </tr>
	          <tr>
	            <td class="text2"><span class="text4">Telephone #</span> <?php echo $rec_found['cno'];?></td>
              </tr>
	          <tr>
	            <td height="8"></td>
              </tr>
	          <tr>
	            <td class="text2"><span class="text4">Address:</span> <?php echo $rec_found['adrs'];?></td>
              </tr>
	          </table></td>
	        <td width="50%"><table width="90%" border="0" align="right" cellpadding="0" cellspacing="0">
	          <tr>
	            <td class="text2"><span class="text4">Invoice No:</span> <?php echo $rec_found['id'];?></td>
              </tr>
	          <tr>
	            <td height="8"></td>
              </tr>
	          <tr>
	            <td class="text2"><span class="text4">Order Date</span> <?php echo $rec_found['idate'];?></td>
              </tr>
	          <tr>
	            <td height="8"></td>
              </tr>
	          <tr>
	            <td class="text2"><span class="text4">Billing Date:</span> <?php echo date("Y-m-d");?></td>
              </tr>
	          <tr>
	            <td height="8"></td>
              </tr>
	          <tr>
	            <td class="text2"><span class="text4">Invoice Status:</span> <?php echo $rec_found['statuss'];?></td>
              </tr>
	          </table></td>
          </tr>
	      <tr>
	        <td>&nbsp;</td>
	        <td>&nbsp;</td>
          </tr>
	      <tr>
	        <td colspan="2"><table width="100%" border="1" cellspacing="0" cellpadding="4" bordercolor="#CCCCCC">
	          <tr class="Heading1">
	            <td width="10%" height="25" align="center">S No.</td>
	            <td width="57%" align="center">Product Name</td>
	            <td width="33%" align="center">Amount </td>
              </tr>
	          <tr>
	            <td height="8" colspan="3"></td>
              </tr>
	          <tr>
	            <td class="text7">01</td>
	            <td><span class="text2"><?php echo $rec_found['pname'];?></span></td>
	            <td><span class="text2">Rs. <?php echo $rec_found[''];?></span></td>
              </tr>
	          <tr>
	            <td>&nbsp;</td>
	            <td>&nbsp;</td>
	            <td>&nbsp;</td>
              </tr>
	          <tr>
	            <td>&nbsp;</td>
	            <td align="right" class="Heading1" style="padding-right:10px;">Total Amount </td>
	            <td><span class="text2">Rs. <?php echo $rec_found[''];?></span></td>
              </tr>
	          </table></td>
          </tr>
	      <tr>
	        <td colspan="2">&nbsp;</td>
          </tr>
	      <tr>
	        <td colspan="2" align="center"><a href="javascript:window.print()"><img src="images/print_button.jpg" width="126" height="38" border="0" /></a></td>
          </tr>
	      <tr>
	        <td colspan="2">&nbsp;</td>
          </tr>
	      </table></td>
      </tr>
	  <tr>
	    <td>&nbsp;</td>
      </tr>
</table>
	<!-- Main Table End -->
</body>
</html>
