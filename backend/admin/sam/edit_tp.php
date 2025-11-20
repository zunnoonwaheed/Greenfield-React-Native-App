<?php require_once("includes/db_settings.php"); ?>
<?php include("chkLogin.php"); ?>
<?php
$id = $_GET['pageID'];

//header("masterpage.php?m_title=Company Name");
/*
$m_title = $_POST['m_title'];
if($m_title=="")
{
	$m_title=$_GET['m_title'];
}
if($m_title=="")
{
	$m_title="Company Name CMS";
}
*/
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>Pro Writer Admin Panel</title>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
<!--<title>Altawash Admin Panel </title>-->
<link href="../stylesheets/public.css" rel="stylesheet" type="text/css" />
<link href="css/style.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="tiny_mce/tiny_mce.js"></script>
<script type="text/javascript">

	// O2k7 skin
	tinyMCE.init({
		// General options
		mode : "exact",
		elements : "pageData",
		theme : "advanced",
		plugins : "jbimages,autolink,lists,pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template,wordcount,advlist,autosave",

		// Theme options
		theme_advanced_buttons1 : "jbimages,save,newdocument,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,styleselect,formatselect,fontselect,fontsizeselect",
		theme_advanced_buttons2 : "cut,copy,paste,pastetext,pasteword,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,|,insertdate,inserttime,preview,|,forecolor,backcolor",
		theme_advanced_buttons3 : "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|,fullscreen",
		theme_advanced_buttons4 : "insertlayer,moveforward,movebackward,absolute,|,styleprops,|,cite,abbr,acronym,del,ins,attribs,|,visualchars,nonbreaking,template,pagebreak,restoredraft",
		theme_advanced_toolbar_location : "top",
		theme_advanced_toolbar_align : "left",
		theme_advanced_statusbar_location : "bottom",
		theme_advanced_resizing : true,

		// Example content CSS (should be your site CSS)
		content_css : "css/content.css",

		// Drop lists for link/image/media/template dialogs
		template_external_list_url : "lists/template_list.js",
		external_link_list_url : "lists/link_list.js",
		external_image_list_url : "lists/image_list.js",
		media_external_list_url : "lists/media_list.js",

		// Style formats
		style_formats : [
			{title : 'Bold text', inline : 'b'},
			{title : 'Red text', inline : 'span', styles : {color : '#ff0000'}},
			{title : 'Red header', block : 'h1', styles : {color : '#ff0000'}},
			{title : 'Example 1', inline : 'span', classes : 'example1'},
			{title : 'Example 2', inline : 'span', classes : 'example2'},
			{title : 'Table styles'},
			{title : 'Table row 1', selector : 'tr', classes : 'tablerow1'}
		],

		// Replace values for the template plugin
		template_replace_values : {
			username : "Some User",
			staffid : "991234"
		}
	});
	
		tinyMCE.init({
		// General options
		mode : "exact",
		elements : "desc1",
		theme : "advanced",
		plugins : "jbimages,autolink,lists,pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template,wordcount,advlist,autosave",

		// Theme options
		theme_advanced_buttons1 : "jbimages,save,newdocument,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,styleselect,formatselect,fontselect,fontsizeselect",
		theme_advanced_buttons2 : "cut,copy,paste,pastetext,pasteword,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,|,insertdate,inserttime,preview,|,forecolor,backcolor",
		theme_advanced_buttons3 : "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|,fullscreen",
		theme_advanced_buttons4 : "insertlayer,moveforward,movebackward,absolute,|,styleprops,|,cite,abbr,acronym,del,ins,attribs,|,visualchars,nonbreaking,template,pagebreak,restoredraft",
		theme_advanced_toolbar_location : "top",
		theme_advanced_toolbar_align : "left",
		theme_advanced_statusbar_location : "bottom",
		theme_advanced_resizing : true,

		// Example content CSS (should be your site CSS)
		content_css : "css/content.css",

		// Drop lists for link/image/media/template dialogs
		template_external_list_url : "lists/template_list.js",
		external_link_list_url : "lists/link_list.js",
		external_image_list_url : "lists/image_list.js",
		media_external_list_url : "lists/media_list.js",

		// Style formats
		style_formats : [
			{title : 'Bold text', inline : 'b'},
			{title : 'Red text', inline : 'span', styles : {color : '#ff0000'}},
			{title : 'Red header', block : 'h1', styles : {color : '#ff0000'}},
			{title : 'Example 1', inline : 'span', classes : 'example1'},
			{title : 'Example 2', inline : 'span', classes : 'example2'},
			{title : 'Table styles'},
			{title : 'Table row 1', selector : 'tr', classes : 'tablerow1'}
		],

		// Replace values for the template plugin
		template_replace_values : {
			username : "Some User",
			staffid : "991234"
		}
	});

</script>

</head>

<body>
	<!-- Main Table Start -->
	<table width="100%" border="0" cellpadding="0" cellspacing="0">
		<tr>
			<td>	<!-- Table Frame Top, Middle, & Botton Start -->
					<table width="100%" border="1" cellpadding="0" cellspacing="0">
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
                            <td valign="top">
								<!-- Right Page Content Placement -->
								<table width="100%" border="0" cellpadding="0" cellspacing="0">
									  <tr>
										<td valign="top">
												<table width="100%" border="0" cellpadding="0" cellspacing="0">
												  <tr height="20">
													<td height="30" bgcolor="#F0F8FF" class="Heading6">
													<!-- Page Title Content Placement -->
													<span class="heading">Edit Text Pages</span> </td>
				  </tr>
						  <tr>
							<td><table width="100%" border="1" cellpadding="5">
                              <tr>
                                <td><form id="form2" name="form2" method="post" action="edited_tp.php">
                                			
                                  
                                    <?php 
								$query = "select * from textpage where id={$id}";
								//echo $query;
								$result = mysql_query($query,$con); 
								$row = mysql_fetch_array($result);
								
									//echo " <h2>". $row['page_title'] . "</h2>";
								
								?>
                                    
                                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                    <tr>
                                      <td width="25%"><input name="id" type="hidden" value="<?php echo $row['id']; ?>" /></td>
                                      <td width="82%">&nbsp;</td>
                                    </tr>
                                    <tr>
                                      <td width="25%" class="hrBlack">Page Title:</td>
                                      <td width="82%" align="left">
                                      <input name="namee" type="text" id="namee" value="<?php echo $row['namee'];?>" size="35" /></td>
                                    </tr>
                                    <tr>
                                      <td>&nbsp;</td>
                                      <td>&nbsp;</td>
                                    </tr>
                                    <tr>
                                      <td class="hrBlack">Short Description</td>
                                      <td><label for="desc1"></label>
                                        <textarea name="desc1" id="desc1" cols="45" rows="5"><?php echo $row['desc1'];?></textarea></td>
                                    </tr>
                                    <tr>
                                      <td>&nbsp;</td>
                                      <td>&nbsp;</td>
                                    </tr>
                                    <tr>
                                      <td class="hrBlack">Page Description</td>
                                      <td><textarea name="pageData" cols="90" rows="20"><?php echo $row['pageData']; ?></textarea></td>
                                    </tr>
                                    <tr>
                                      <td colspan="2">&nbsp;</td>
                                      </tr>
                                    <tr>
                                      <td colspan="2"><table width="90%" border="0" cellspacing="0" cellpadding="0">
                                        <tr>
                                          <td height="25" colspan="2" bgcolor="#EAEAEA" class="Heading1">Title &amp; Meta Tags</td>
                                          </tr>
                                        <tr>
                                          <td>&nbsp;</td>
                                          <td>&nbsp;</td>
                                        </tr>
                                        <tr>
                                          <td width="20%" class="text7">Page Title</td>
                                          <td width="80%"><label for="title"></label>
                                            <input name="title" type="text" class="text6" id="title" size="60" value="<?php echo $row['title'];?>" /></td>
                                        </tr>
                                        <tr>
                                          <td>&nbsp;</td>
                                          <td>&nbsp;</td>
                                        </tr>
                                        <tr>
                                          <td class="text7">Meta Keyword</td>
                                          <td><label for="keyword"></label>
                                            <textarea name="keyword" cols="65" rows="5" class="text6" id="keyword"><?php echo $row['keyword'];?></textarea></td>
                                        </tr>
                                        <tr>
                                          <td>&nbsp;</td>
                                          <td>&nbsp;</td>
                                        </tr>
                                        <tr>
                                          <td class="text7">Meta Description</td>
                                          <td><label for="descr"></label>
                                            <textarea name="descr" cols="65" rows="5" class="text6" id="descr"><?php echo $row['descr'];?></textarea></td>
                                        </tr>
                                      </table></td>
                                    </tr>
                                    <tr>
                                      <td colspan="2">&nbsp;</td>
                                    </tr>
                                    <tr>
                                      <td colspan="2" align="center"><input name="Submit2" type="submit" class="text7" value="Update" /></td>
                                      </tr>
                                  </table>
                                 
</form></td>
                              </tr>
                              
                              <tr>
                                <td>&nbsp;</td>
                              </tr>
                            </table>					        </td>
						  </tr>
	  </table>	</td>
			  </tr>
			</table>							</td>
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
