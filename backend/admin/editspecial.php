<?php
include("chkLogin.php");
include("includes/db_settings.php");
?>
  <?php 
		$query = "select * from products where id=1";
		//echo $query;
		
				$result = mysqli_query($con,$query); 
								$row = mysqli_fetch_array($result);
				
		
							
							
		?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>Pro Writer Admin Panel</title>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
<!--<title>Altawash Admin Panel </title>-->
<link href="css/style.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="tiny_mce/tiny_mce.js"></script>
<script type="text/javascript">

	// O2k7 skin
	tinyMCE.init({
		// General options
		mode : "exact",
		elements : "desc1",
		theme : "advanced",
		plugins : "jbimages,autolink,lists,pagereturn,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonreturning,xhtmlxtras,template,wordcount,advlist,autosave",

		// Theme options
		theme_advanced_buttons1 : "jbimages,save,newdocument,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,styleselect,formatselect,fontselect,fontsizeselect",
		theme_advanced_buttons2 : "cut,copy,paste,pastetext,pasteword,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,|,insertdate,inserttime,preview,|,forecolor,backcolor",
		theme_advanced_buttons3 : "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|,fullscreen",
		theme_advanced_buttons4 : "insertlayer,moveforward,movebackward,absolute,|,styleprops,|,cite,abbr,acronym,del,ins,attribs,|,visualchars,nonreturning,template,pagereturn,restoredraft",
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
	
	
		// O2k7 skin
	tinyMCE.init({
		// General options
		mode : "exact",
		elements : "reviews",
		theme : "advanced",
		plugins : "jbimages,autolink,lists,pagereturn,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonreturning,xhtmlxtras,template,wordcount,advlist,autosave",

		// Theme options
		theme_advanced_buttons1 : "jbimages,save,newdocument,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,styleselect,formatselect,fontselect,fontsizeselect",
		theme_advanced_buttons2 : "cut,copy,paste,pastetext,pasteword,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,|,insertdate,inserttime,preview,|,forecolor,backcolor",
		theme_advanced_buttons3 : "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|,fullscreen",
		theme_advanced_buttons4 : "insertlayer,moveforward,movebackward,absolute,|,styleprops,|,cite,abbr,acronym,del,ins,attribs,|,visualchars,nonreturning,template,pagereturn,restoredraft",
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
		elements : "long_german",
		theme : "advanced",
		plugins : "jbimages,autolink,lists,pagereturn,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonreturning,xhtmlxtras,template,wordcount,advlist,autosave",

		// Theme options
		theme_advanced_buttons1 : "jbimages,save,newdocument,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,styleselect,formatselect,fontselect,fontsizeselect",
		theme_advanced_buttons2 : "cut,copy,paste,pastetext,pasteword,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,|,insertdate,inserttime,preview,|,forecolor,backcolor",
		theme_advanced_buttons3 : "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|,fullscreen",
		theme_advanced_buttons4 : "insertlayer,moveforward,movebackward,absolute,|,styleprops,|,cite,abbr,acronym,del,ins,attribs,|,visualchars,nonreturning,template,pagereturn,restoredraft",
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
	
	


	// O2k7 skin
	tinyMCE.init({
		// General options
		mode : "exact",
		elements : "desc_german",
		theme : "advanced",
		plugins : "jbimages,autolink,lists,pagereturn,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonreturning,xhtmlxtras,template,wordcount,advlist,autosave",

		// Theme options
		theme_advanced_buttons1 : "jbimages,save,newdocument,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,styleselect,formatselect,fontselect,fontsizeselect",
		theme_advanced_buttons2 : "cut,copy,paste,pastetext,pasteword,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,|,insertdate,inserttime,preview,|,forecolor,backcolor",
		theme_advanced_buttons3 : "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|,fullscreen",
		theme_advanced_buttons4 : "insertlayer,moveforward,movebackward,absolute,|,styleprops,|,cite,abbr,acronym,del,ins,attribs,|,visualchars,nonreturning,template,pagereturn,restoredraft",
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
								<table width="100%" border="0" cellspacing="0" cellpadding="0">
								  <tr>
								    <td height="25" colspan="4" bgcolor="#F0F8FF" class="Heading6">Edit Special Offer</td>
							      </tr>
								  <tr>
								    <td>&nbsp;</td>
								    <td>&nbsp;</td>
								    <td>&nbsp;</td>
								    <td>&nbsp;</td>
							      </tr>
								  <tr>
								    <td colspan="4" valign="top"><form action="specialUpdated.php" method="post" name="form1" id="form1">
								      <table width="100%" border="0" cellspacing="0" cellpadding="0">
								        <tr>
								          <td width="21%" align="left" class="text7">Name</td>
								          <td width="79%"><label for="namee"></label>
								            <input name="namee" type="text" class="text7" id="namee" size="40" value="<?php echo $row['namee']; ?>" /></td>
							            </tr>
								        <tr>
								          <td align="left" class="text7">&nbsp;</td>
								          <td align="left">&nbsp;</td>
							            </tr>
								        <tr>
								          <td align="left" class="text7">Select Brand</td>
								          <td align="left"><select name="brand" class="text6" style="width:200px;">
								            <?php 
		$query1 = "select * from brand order by namee ";
		
		$result1 = mysqli_query($con,$query1); 
		$rec_found1 = mysqli_num_rows($result1);
		if($rec_found1 >0){
		while($row1 = mysqli_fetch_array($result1)){;
		?>
								            <option value="<?php echo $row1['namee'];?>" <?php if ($row['brand']==$row1['namee']){?> selected="selected" <?php } ?>><?php echo $row1['namee'];?></option>
								            <?php 
		  
		  } 
		}
		  ?>
								            </select></td>
							            </tr>
								        <tr>
								          <td align="left" class="text7">&nbsp;</td>
								          <td align="left">&nbsp;</td>
							            </tr>
								        <tr>
								          <td align="left" class="text7">Manufacturer Part No.</td>
								          <td align="left"><input name="part" type="text" class="text6" id="part" size="40" value="<?php echo $row['part']; ?>" /></td>
							            </tr>
								        <tr>
								          <td align="left" class="text7">&nbsp;</td>
								          <td align="left">&nbsp;</td>
							            </tr>
								        <tr>
								          <td align="left" class="text7">Short Description</td>
								          <td align="left"><label for="desc1"></label>
								            <textarea name="desc1" id="desc1" cols="65" rows="8"><?php echo $row['desc1']; ?></textarea></td>
							            </tr>
								        <tr>
								          <td align="left" class="text7">&nbsp;</td>
								          <td align="left">&nbsp;</td>
							            </tr>
								        <tr>
								          <td class="text7">Cut down  Price</td>
								          <td><input name="old_" type="text" class="text7" id="old_" size="40" value="<?php echo $row['old_']; ?>" /></td>
							            </tr>
								        <tr>
								          <td class="text7">&nbsp;</td>
								          <td>&nbsp;</td>
							            </tr>
								        <tr>
								          <td class="text7">Price</td>
								          <td><input name="" type="text" class="text7" id="" size="40" value="<?php echo $row['']; ?>" /></td>
							            </tr>
								        <tr>
								          <td>&nbsp;</td>
								          <td>&nbsp;</td>
							            </tr>
								        <tr>
								          <td align="left" class="text7">Display in Home Page</td>
								          <td align="left" class="text6"><input type="radio" name="dhp" id="dhp" value="yes" <?php if ($row['dhp']=="yes"){ ?> checked="checked" <?php } ?> />
								            Yes
								            <input type="radio" name="dhp" id="dhp" value="no" <?php if ($row['dhp']=="no"){ ?> checked="checked" <?php } ?> />
								            No
								            <label for="DHP"></label></td>
							            </tr>
								        <tr>
								          <td>&nbsp;</td>
								          <td>&nbsp;</td>
							            </tr>
								        <tr>
								          <td class="text7">Reviews</td>
								          <td><textarea name="reviews" cols="80" rows="15" class="text6" id="reviews"><?php echo $row['reviews']; ?></textarea></td>
							            </tr>
								        <tr>
								          <td>&nbsp;</td>
								          <td>&nbsp;</td>
							            </tr>
								        <tr>
								          <td class="text7">Jenne Part Number</td>
								          <td><label for="jenne"></label>
								            <input name="jenne" type="text" class="text6" id="jenne" size="40" value="<?php echo $row['jenne']; ?>" /></td>
							            </tr>
								        <tr>
								          <td class="text7">&nbsp;</td>
								          <td>&nbsp;</td>
							            </tr>
								        <tr>
								          <td class="text7">Quantity</td>
								          <td><label for="qty"></label>
								            <input name="qty" type="text" class="text6" id="qty" size="20" value="<?php echo $row['qty']; ?>" /></td>
							            </tr>
								        <tr>
								          <td class="text7">&nbsp;</td>
								          <td>&nbsp;</td>
							            </tr>
								        <tr>
								          <td class="text7">Weight</td>
								          <td><label for="weight"></label>
								            <input name="weight" type="text" class="text6" id="weight" size="20" value="<?php echo $row['weight']; ?>" /></td>
							            </tr>
								        <tr>
								          <td class="text7">&nbsp;</td>
								          <td>&nbsp;</td>
							            </tr>
								        <tr>
								          <td class="text7">UPC</td>
								          <td><label for="upc"></label>
								            <input name="upc" type="text" class="text6" id="upc" size="40" value="<?php echo $row['upc']; ?>" /></td>
							            </tr>
								        <tr>
								          <td>&nbsp;</td>
								          <td>&nbsp;</td>
							            </tr>
								        <tr>
								          <td colspan="2"><table width="100%" border="0" cellspacing="0" cellpadding="0">
								            <tr>
								              <td height="25" colspan="2" bgcolor="#EAEAEA" class="Heading1">Title &amp; Meta Tags</td>
							                </tr>
								            <tr>
								              <td>&nbsp;</td>
								              <td>&nbsp;</td>
							                </tr>
								            <tr>
								              <td width="21%" class="text7">Page Title</td>
								              <td width="79%"><label for="title"></label>
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
								          <td>&nbsp;</td>
								          <td><input type="hidden" name="id" id="id" value="<?php echo $id; ?>" />
								            <input type="hidden" name="catID" id="catID" value="<?php echo $catID; ?>" /></td>
							            </tr>
								        <tr>
								          <td>&nbsp;</td>
								          <td><input name="Submit" type="submit" class="text7" id="Submit" value="Update" />
								            <input name="Reset" type="reset" class="text7" id="Reset" value="Reset" /></td>
							            </tr>
								        <tr>
								          <td>&nbsp;</td>
								          <td>&nbsp;</td>
							            </tr>
							          </table>
							        </form></td>
							      </tr>
						    </table></td>
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
