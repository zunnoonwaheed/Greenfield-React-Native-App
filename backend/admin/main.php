<?php
include("chkLogin1.php");
include("includes/db_settings.php");
$m_title="Company Name CMS";
?>
 <?php if ($_SESSION['role']=="subadmin"){
	 header("Location:price.php");
 }
	 ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>Pro Writer Admin Panel</title>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
<!--<title><?php //echo $m_page_title; ?> CMS </title>-->
<link href="../stylesheets/public.css" rel="stylesheet" type="text/css" />
<link href="css/style.css" rel="stylesheet" type="text/css" />
</head>
<body>
	<!-- Main Table Start -->
	<table width="1004" border="1" align="center" cellpadding="0" cellspacing="0">
		<tr>
			<td>	<!-- Table Frame Top, Middle, & Botton Start -->
					<table width="100%" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td><?php require_once("top.php");  ?>						
						</td>
                      </tr>
                      <tr>
					  	
                        <td><table width="100%" border="0" cellpadding="0" cellspacing="3">
						  <!-- Middle Row -->
                          <tr height="480">
                            <td  valign="top" bgcolor="#EEF7FB">
								<table width="100%" border="0" cellpadding="0" cellspacing="0">
									  <tr>
										<td valign="top">
												<table width="100%" border="0" cellpadding="5">
												  <tr height="20">
													<td align="center"><form action="orders.php" method="post" name="fi" class="text6" id="fi" target="_blank">
                                                      <p class="text3">
                                                        <label for="invno"></label>
                                                        Please Select Website
                                                      </p>
                                                    </form></td>
												  </tr>
												  <tr height="20">
													<td class="Heading5">
													  <div class="menu2" style="clear:both;">
        <ul>
        <?php 
		$query = "select * from video order by namee";
		$result = mysqli_query($con,$query); 
		$rec_found = mysqli_num_rows($result);
		if($rec_found >0){
			while($row = mysqli_fetch_array($result)){;
		?>
          <li><a href="contents.php?websiteID=<?php echo $row['id'];?>" ><?php echo $row['namee'];?>
</a></li><?php } }?>

        </ul>
      </div></td>
				  </tr>
						  </table>
			
	</td>
			  </tr>
			</table></td>
                          </tr>
                        </table>
					</td>
                    </tr>
                    </table>
					<!-- Table Frame Top, Middle, & Botton End -->
		  </td>
		</tr>
</table>
<!-- Main Table End -->
</body>
</html>
