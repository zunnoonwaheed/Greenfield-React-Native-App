<?php
include("chkLogin.php");
include("includes/db_settings.php");
$m_title="Company Name CMS";
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
	<table width="100%" border="1" cellpadding="0" cellspacing="0">
		<tr>
			<td>	<!-- Table Frame Top, Middle, & Botton Start -->
					<table width="100%" border="0" cellpadding="0" cellspacing="0">
                      <tr height="100">
                        <td>
							<!-- Header Content Placement -->
							<?php require_once("top.php");  ?>						
						</td>
                      </tr>
                      <tr>
					  	
                        <td><table width="100%" border="0">
						  <!-- Middle Row -->
                          <tr height="480">
                            <td  valign="top" width="200">
								<!-- Left Navigation Placement -->
								<?php include("left.php"); ?>
							</td>
                            <td valign="top">
								<!-- Right Page Content Placement -->
								<table width="100%" border="0">
									  <tr>
										<td valign="top"><table width="100%" border="0" cellspacing="0" cellpadding="0">
										  <tr>
										    <td height="30" colspan="2" bgcolor="#F0F8FF" class="Heading6">Manage Text Pages</td>
									      </tr>
										  <tr>
										    <td colspan="2" bgcolor="#7DB8DB">&nbsp;</td>
									      </tr>
										  <tr>
										    <td colspan="2" bgcolor="#EEF7FB">&nbsp;</td>
									      </tr>
										  <tr>
										    <td colspan="2">&nbsp;</td>
									      </tr>
                                          <?php
	 $tp_id = $_REQUEST['pageID'];	
	   if ($tp_id!="")
		  {
		  ?>
                                          <?php 

		$query = "select * from textpage where id={$tp_id}";
		//echo $query;
		$result = mysql_query($query,$con); 
		$row = mysql_fetch_array($result);
		?>
										  <tr>
										    <td width="75%" class="Heading4"><?php echo $row['namee'];?></td>
										    <td bgcolor="#EEF7FB"><a href="edit_tp.php?pageID=<?php echo $tp_id; ?>">Edit Data</a></td>
									      </tr>
										  <tr>
										    <td colspan="2">&nbsp;</td>
									      </tr>
										  <tr>
										    <td colspan="2" class="text6"><?php echo $row['pageData'];?></td>
									      </tr>
                                          <?php
		  }
		  ?>
										  <tr>
										    <td colspan="2">&nbsp;</td>
									      </tr>
									    </table></td>
			  </tr>
			</table>

							</td>
                          </tr>
                        </table>
					</td>
                    </tr>
                      <tr>
                        <td>
							<?php include("bottom.php");  ?>						
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
