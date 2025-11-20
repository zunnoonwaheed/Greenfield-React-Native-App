<?php require_once("includes/db_settings.php"); ?>
<?php include("chkLogin.php"); ?>
<?php
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
	<table width="100%" border="0" cellpadding="0" cellspacing="0">
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
					  	
                        <td><table width="100%" border="0" cellpadding="0" cellspacing="0">
						  <!-- Middle Row -->
                          <tr height="480">
                            <td  valign="top" width="200">
								<!-- Left Navigation Placement -->
								<?php include("left.php"); ?>							</td>
                            <td valign="top"><table width="100%" border="0" cellpadding="0" cellspacing="0">
                              <tr height="20">
                                <td height="30" bgcolor="#F0F8FF" class="Heading6"><!-- Page Title Content Placement -->
                                  <span class="heading">Manage Text Pages</span></td>
                              </tr>
                              <tr>
                                <td><table width="100%" border="0" cellpadding="0" cellspacing="0">
                                  <tr class="Heading4">
                                    <td height="25" colspan="3" align="center" bgcolor="#FFFFFF"><a href="ins_tp.php">Insert Text Pages</a></td>
                                  </tr>
                                  <tr class="Heading4">
                                    <td align="center" bgcolor="#EEF7FB">#</td>
                                    <td width="311" height="25" align="center" bgcolor="#EEF7FB">Text Pages Title</td>
                                    <td align="center" bgcolor="#EEF7FB">Options</td>
                                  </tr>
                                  <?php 
							$query = "select * from textpage order by id asc";
							//echo $query;
							$s = 1;
							$result = mysql_query($query,$con); 
							while($row = mysql_fetch_array($result))
							{
							?>
                                  <tr class="text7">
                                    <td width="40" align="center" style="<?php if($s & 1) {?> background-color:#F0F0F0; border-bottom:solid 1px #000; height:25px; padding-left:7px; border-left:solid 1px #000; <?php } else {?>border-bottom:solid 1px #000; height:25px; padding-left:7px; border-left:solid 1px #000; <?php } ?>"><?php echo $s; ?></td>
                                    <td class="hrBlack" style="<?php if($s & 1) {?> background-color:#F0F0F0; border-right:solid 1px #000; border-bottom:solid 1px #000; height:25px; padding-left:7px; border-left:solid 1px #000; <?php } else {?>border-bottom:solid 1px #000; border-right:solid 1px #000; height:25px; padding-left:7px; border-left:solid 1px #000; <?php } ?>"><?php echo $row['namee']; ?></td>
                                    <td width="170" align="center" style="<?php if($s & 1) {?> background-color:#F0F0F0; border-bottom:solid 1px #000; height:25px; border-right:solid 1px #000 <?php } else {?>border-bottom:solid 1px #000; height:25px; border-right:solid 1px #000 <?php } ?>" ><a href="textpage.php?pageID=<?php echo $row['id'];?>">View Page</a> <?php
                                if (($row['id']==1)||($row['id']==2)||($row['id']==3)||($row['id']==4)||($row['id']==5)||($row['id']==6)||($row['id']==7)||($row['id']==8)||($row['id']==9)||($row['id']==10)||($row['id']==11)||($row['id']==12)){
								?>
                                &nbsp;
                                <?php
								}
								else
							{
								?>
                                 - <a href="del_tp.php?id=<?php echo $row['id'];?>">Delete Text Page</a><?php
								}
								?></td>
                                  </tr>
                                  <?php $s++; } ?>
                                </table></td>
                              </tr>
                            </table>
                            <!-- Right Page Content Placement --></td>
                          </tr>
                        </table>					</td>
                    </tr>
                      <tr>
                        <td>
							<?php include("bottom.php");  ?>						</td>
                      </tr>
                    </table>
					<!-- Table Frame Top, Middle, & Botton End -->
		  </td>
		</tr>
</table>
<!-- Main Table End -->
</body>
</html>
