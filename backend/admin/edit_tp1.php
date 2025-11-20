<?php include('head.php');
$controls=new htmlControl;
$id = $_GET['pageID'];
$imgName = $_GET['imgName'];
$imgName1 = $_GET['imgName1'];
?>
<link href="css/plugins/summernote/summernote.css" rel="stylesheet">
<link href="css/plugins/summernote/summernote-bs3.css" rel="stylesheet">
<body>
    <div id="wrapper">
        <?php include('left.php');?>
        <div id="page-wrapper" class="gray-bg">
            <?php include('header.php');
            echo $controls->getHeaderSection('manage writers');
            ?>
            <div class="wrapper wrapper-content animated fadeInRight">
                <div class="row">
                    <div class="col-lg-12">
                        <div class="tabs-container">
                            <ul class="nav nav-tabs">
                                <li class="active"><a data-toggle="tab" href="#tab-1"> Page Detail</a></li>
                                <li class=""><a data-toggle="tab" href="#tab-2"> Title & Meta Tags</a></li>
                            </ul>
                            <form action="edited_tp.php" method="post" enctype="multipart/form-data" onsubmit="return postForm()">
                            <div class="tab-content">
                                <?php 
                                $query = "select * from textpage where id={$id}";
                                $result = mysqli_query($con,$query);
                                $row = mysqli_fetch_array($result);?>
                                <div id="tab-1" class="tab-pane active">
                                    <div class="panel-body">
                                        <input name="id" type="hidden" value="<?php echo $row['id']; ?>" />
                                        <input type="hidden" name="imgName" id="imgName" value="<?php echo $imgName; ?>" />
                                        <input type="hidden" name="imgName1" id="imgName1" value="<?php echo $imgName1; ?>" />
                                        <fieldset class="form-horizontal">

                                            <div class="form-group"><label class="col-sm-2 control-label">Page Title:</label>
                                                <div class="col-sm-10">
                                                    <input name="namee" type="text" id="namee" value="<?php echo $row['namee'];?>" class="form-control" ></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-2 control-label">Menu Title:</label>
                                                <div class="col-sm-10">
                                                    <input name="menu_namee" type="text" id="menu_namee" value="<?php echo $row['menu_namee'];?>"
                                                        class="form-control" ></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-2 control-label">Page Slug:</label>
                                                <div class="col-sm-3">

                                                    <select name="slug1" class="form-control">
                                               <option value="official"<?php if ($row['slug1']=="official"){?> selected="selected" <?php }?>>official</option>
                                                        <option value="writing"<?php if ($row['slug1']=="writing"){?> selected="selected" <?php }?>>writing</option>
                                                    </select>
                                                </div>
                                                <div class="col-sm-4">
                                                <input type="text" name="slug" id="slug_input" value="<?php echo $row['slug'];?>" class="form-control" /></div>
                                            </div>

                                            <div class="form-group">
                                                <label class="col-sm-2 control-label">Icon</label>
                                                <div class="col-sm-10">
                                                    <input name="icon" type="text" id="icon" class="form-control" value="<?php echo $row['icon'];?>" /></div></div>

                                            <div class="form-group"><label class="col-sm-2 control-label">Tagline</label>
                                                <div class="col-sm-10">

                                                    <textarea name="tagline" cols="65" rows="4" class="form-control"  id="tagline"><?php echo $row['tagline'];?></textarea>


                                                </div>
                                            </div>
                                            
                                            
                                            <div class="form-group"><label class="col-sm-2 control-label">Select Image</label>
                                                <div class="col-sm-10">

                                                   <input name="file1" type="file" class="form-control" id="file1" />
                                                </div>
                                            </div>

                                            <div class="form-group"><label class="col-sm-2 control-label">Menu Icon Image</label>
                                                <div class="col-sm-10">

                                                    <input name="file2" type="file" class="form-control" id="file2" />
                                                    <font color="#E94C3D">(Image Size width=&quot;24px&quot; height=&quot;24px&quot;)</font>
                                                </div>
                                            </div>
  
                                            <div class="form-group"><label class="col-sm-2 control-label">Display in</label>
                                                <div class="col-sm-10">
                                                    <select name="desc1" class="form-control">
                                                        <option value="top" <?php if ($row['desc1']=="top"){?> selected="selected" <?php } ?>>Top Menu</option>

                                                        <option value="footer" <?php if ($row['desc1']=="footer"){?> selected="selected" <?php } ?>>Bottom Menu</option>
                                                         <option value="both" <?php if ($row['desc1']=="both"){?> selected="selected" <?php } ?>>Both Menu</option>
                                                        <option value="none" <?php if ($row['desc1']=="none"){?> selected="selected" <?php } ?>>None</option>
                                                    </select></div></div>

                                           <!-- <div class="form-group"><label class="col-sm-2 control-label">Primary Page</label>
                                                <div class="col-sm-10">
                                                    <select name="pageID" id="pageID" class="form-control">


                                                        <option value="0" <?php if($row['pageID']==0){?> selected="selected"<?php } ?>>Select Primary Page</option>
                                                        <?php
                                                        $query_top = "select * from textpage where desc1='top' AND pageID=0 order by id";
                                                        $result_top = mysqli_query($con,$query_top); 
                                                        while($row_top = mysqli_fetch_array($result_top))
                                                        {

                                                        ?>
                                                            <option value="<?php echo $row_top['id'];?>" <?php if($row_top['id']==$row['pageID']){?> selected="selected"<?php } ?>><?php echo $row_top['namee'];?></option>
                                                        <?php } ?>

                                                    </select>
                                                </div></div>-->
                                            <div class="form-group"><label class="col-sm-2 control-label">Short Description</label>
                                                <div class="col-sm-10">
                                                    <textarea name="short_desc" class="form-control"><?php echo $row['short_desc'];?></textarea>
                                                    
                                                </div>
                                            </div>

                                            <div class="form-group"><label class="col-sm-2 control-label">Page Description</label>
                                                <div class="col-sm-10"><textarea class="form-control" id="summernote" name="pageData"><?php echo $row['pageData'];?></textarea>
                                                    </div>
                                            </div>



                                        </fieldset>

                                    </div>
                                </div>
                                <div id="tab-2" class="tab-pane">
                                    <div class="panel-body">

                                        <fieldset class="form-horizontal">
                                            <div class="form-group"><label class="col-sm-2 control-label">Page Title</label>
                                                <div class="col-sm-10">
                                                    <input type="text" name="title" id="title" class="form-control" value="<?php echo $row['title'];?>"></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-2 control-label">Meta Keyword</label>
                                                <div class="col-sm-10"><input type="text" class="form-control" name="keyword" id="keyword" value="<?php echo $row['keyword'];?>"></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-2 control-label">Meta Description</label>
                                                <div class="col-sm-10">
                                                    <input type="text" name="descr" class="form-control" value="<?php echo $row['descr'];?>"></div>
                                            </div>
                                            <div class="form-group"><label class="col-sm-2 control-label">Additional Headers</label>
                                                <div class="col-sm-10">
                                                    <textarea name="addhead"
                                                        class="form-control" id="addhead">
                                                    <?php echo $row['addhead']; ?></textarea>
                                                </div>
                                            </div>
                                        </fieldset>


                                    </div>
                                </div>


                            </div>
                        </div><input name="Submit2" type="submit" class="btn btn-block btn-outline btn-success" value="Update" /></form>
                    </div>
                </div>
            </div>
            <?php include('footer.php'); ?>

        </div>
    </div>
</body>


<?php include('script.php'); ?>    
<script src="js/plugins/summernote/summernote.min.js"></script>
<script type="text/javascript" charset="utf-8">
$(function() {
 $('#summernote').summernote({
      height: 300,
      onImageUpload: function(files, editor, $editable) {
      sendFile(files[0],editor,$editable);
      }  
	  

    });
	
    function sendFile(file,editor,welEditable) {
      data = new FormData();
      data.append("file", file);
       $.ajax({
       url: "summernote.php",
       data: data,
       cache: false,
       contentType: false,
       processData: false,
       type: 'POST',
       success: function(data){
       alert(data);
        editor.insertImage(welEditable, data);
    },
       error: function(jqXHR, textStatus, errorThrown) {
       console.log(textStatus+" "+errorThrown);
      }
    });
   }

  });		
			var postForm = function() {
	var content = $('textarea[name="pageData"]').html($('#summernote').code());
}
 var config = {
                '.chosen-select'           : {},
                '.chosen-select-deselect'  : {allow_single_deselect:true},
                '.chosen-select-no-single' : {disable_search_threshold:10},
                '.chosen-select-no-results': {no_results_text:'Oops, nothing found!'},
                '.chosen-select-width'     : {width:"95%"}
                }
            for (var selector in config) {
                $(selector).chosen(config[selector]);
            }
</script>
</body>
</html>
